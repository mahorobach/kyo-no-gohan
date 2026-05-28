import { useEffect, useState } from 'react';
import ScreenOnboarding from './screens/ScreenOnboarding';
import ScreenPasswordReset from './screens/ScreenPasswordReset';
import HomeA from './screens/HomeA';
import ScreenCamera from './screens/ScreenCamera';
import ScreenAnalyzing from './screens/ScreenAnalyzing';
import ScreenIngredients from './screens/ScreenIngredients';
import ScreenRecipes from './screens/ScreenRecipes';
import ScreenDetail from './screens/ScreenDetail';
import ScreenTextInput from './screens/ScreenTextInput';
import ScreenSaved from './screens/ScreenSaved';
import ScreenCooking from './screens/ScreenCooking';
import ScreenHistory from './screens/ScreenHistory';
import ScreenProfile from './screens/ScreenProfile';
import { analyzeIngredientPhotos, fetchRecipes } from './lib/gemini';
import { recipePatterns } from './data/recipePatterns';
import useAuth from './contexts/useAuth';
import { isSupabaseConfigured, fetchProfile, upsertProfile } from './lib/supabase';
import { T, FONT } from './tokens';
import ScreenAdmin from './screens/ScreenAdmin';

const RECENT_GENERATION_LIMIT = 12;
const SAVED_RECIPES_STORAGE_KEY = 'kyou-no-gohan:saved-recipes';
const PROFILE_STORAGE_KEY = 'kyou-no-gohan:profile';
const GENERATIONS_STORAGE_KEY = 'kyou-no-gohan:recent-generations';
const GENERATION_USAGE_STORAGE_KEY = 'kyou-no-gohan:generation-usage';
const FREE_DAILY_GENERATION_LIMIT = 3;
const PAID_DAILY_GENERATION_LIMIT = 10;
const ADMIN_EMAIL = 'dokakao@gmail.com';

const normalizeTitle = (title = '') => title.replace(/\s+/g, '').trim();

const MOCK_PHOTO_BATCHES = [
  [
    { k: 'tofu', name: 'ソイミート', qty: '1袋', conf: 95 },
    { k: 'pepper', name: 'ピーマン', qty: '4個', conf: 91 },
    { k: 'carrot', name: '人参', qty: '1本', conf: 88 },
  ],
  [
    { k: 'tofu', name: '木綿豆腐', qty: '1丁', conf: 93 },
    { k: 'cabbage', name: 'キャベツ', qty: '1/4玉', conf: 87 },
    { k: 'miso', name: '干椎茸', qty: '5枚', conf: 84 },
  ],
  [
    { k: 'cabbage', name: 'キャベツ', qty: '1/2玉', conf: 92 },
    { k: 'sprouts', name: '緑豆春雨', qty: '30g', conf: 85 },
    { k: 'ginger', name: '生姜', qty: '2かけ', conf: 82 },
  ],
  [
    { k: 'pepper', name: 'なす', qty: '3本', conf: 88 },
    { k: 'tofu', name: '角麩', qty: '1/2袋', conf: 90 },
    { k: 'carrot', name: 'ごぼう', qty: '1本', conf: 85 },
  ],
];

const loadSavedRecipes = () => {
  try {
    const savedText = window.localStorage.getItem(SAVED_RECIPES_STORAGE_KEY);
    if (!savedText) return [];

    const parsed = JSON.parse(savedText);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('レシピ帳の読み込みに失敗しました', error);
    return [];
  }
};

const getTodayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
};

const getGenerationLimit = (profile = {}) => {
  if (profile.plan === 'tester') return Infinity;
  if (profile.plan === 'paid') return PAID_DAILY_GENERATION_LIMIT;
  return FREE_DAILY_GENERATION_LIMIT;
};

const loadRecentGenerations = () => {
  try {
    const savedText = window.localStorage.getItem(GENERATIONS_STORAGE_KEY);
    if (!savedText) return [];

    const parsed = JSON.parse(savedText);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('生成履歴の読み込みに失敗しました', error);
    return [];
  }
};

const loadGenerationUsage = () => {
  const todayKey = getTodayKey();

  try {
    const savedText = window.localStorage.getItem(GENERATION_USAGE_STORAGE_KEY);
    if (!savedText) return { date: todayKey, count: 0 };

    const parsed = JSON.parse(savedText);
    if (parsed?.date !== todayKey) return { date: todayKey, count: 0 };

    return {
      date: todayKey,
      count: Number.isFinite(parsed.count) ? parsed.count : 0,
    };
  } catch (error) {
    console.error('生成回数の読み込みに失敗しました', error);
    return { date: todayKey, count: 0 };
  }
};

const loadProfile = () => {
  try {
    const profileText = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!profileText) return { name: 'さくらこ', plan: 'free' };

    const parsed = JSON.parse(profileText);
    return {
      name: typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim() : 'さくらこ',
      plan: ['free', 'paid', 'tester'].includes(parsed.plan) ? parsed.plan : 'free',
    };
  } catch (error) {
    console.error('プロフィールの読み込みに失敗しました', error);
    return { name: 'さくらこ', plan: 'free' };
  }
};

const mergeUniqueRecipes = (currentRecipes = [], nextRecipes = []) => {
  const seenTitles = new Set(currentRecipes.map((recipe) => normalizeTitle(recipe.title)));
  const uniqueNext = nextRecipes.filter((recipe) => {
    const key = normalizeTitle(recipe.title);
    if (!key || seenTitles.has(key)) return false;
    seenTitles.add(key);
    return true;
  });

  return {
    merged: [...currentRecipes, ...uniqueNext],
    added: uniqueNext,
  };
};

const getApiFallbackMessage = (error, action = 'display') => {
  const message = error instanceof Error ? error.message : '';
  const isQuotaError = /429|quota|RESOURCE_EXHAUSTED|rate/i.test(message);

  if (isQuotaError) {
    return action === 'add'
      ? 'AI生成の無料枠上限に達したため、サンプル提案を追加しました。少し時間をおいてもう一度試してください。'
      : 'AI生成の無料枠上限に達したため、サンプル提案で表示しています。少し時間をおいてもう一度試してください。';
  }

  return action === 'add'
    ? 'APIがうまく応答しなかったため、サンプル提案を追加しました。'
    : 'APIがうまく応答しなかったため、サンプル提案で表示しています。';
};

const getPhotoFallbackMessage = (error) => {
  const message = error instanceof Error ? error.message : '';
  const isQuotaError = /429|quota|RESOURCE_EXHAUSTED|rate/i.test(message);

  return isQuotaError
    ? 'AI判定の無料枠上限に達したため、サンプル食材で表示しています。少し時間をおいてもう一度試してください。'
    : '写真判定がうまく応答しなかったため、サンプル食材で表示しています。';
};

const normalizeConditions = (conditions = []) => {
  const selected = Array.isArray(conditions)
    ? conditions
    : conditions ? [conditions] : [];
  const cleaned = selected.map((item) => String(item).trim()).filter(Boolean);
  if (!cleaned.length || cleaned.includes('おまかせ')) return ['おまかせ'];
  return cleaned.slice(0, 2);
};

const getConditionLabel = (conditions = []) => normalizeConditions(conditions).join('・');

const limitGeneratedRecipes = (recipes = []) => recipes.slice(0, 2);

const makeGeneration = ({ recipes, ingredients, conditions }) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  createdAt: new Date().toISOString(),
  ingredients: ingredients.map((item) => ({ name: item.name, k: item.k ?? null })),
  conditions: normalizeConditions(conditions),
  recipes: limitGeneratedRecipes(recipes),
});

const makeStepsFromPattern = (pattern) => {
  const steps = [];
  if (pattern.tips?.[0]) {
    steps.push(pattern.tips[0]);
  } else {
    const mainNames = (pattern.requiredIngredients ?? []).slice(0, 2).join('、');
    steps.push(`${mainNames || '材料'}を食べやすい大きさに切り、下準備をする。`);
  }
  steps.push(`フライパンまたは鍋に油を熱し、材料を${pattern.method ?? '炒める'}。`);
  steps.push(`${pattern.flavor ?? '醤油・だし'}で味をととのえる。`);
  if (pattern.tips?.[1]) {
    steps.push(pattern.tips[1]);
  } else {
    steps.push('全体に火が通ったら器に盛り付けて完成。');
  }
  return steps;
};

const patternToRecipe = (pattern, inputIngredients, category) => {
  const inputNames = new Set(inputIngredients.map((i) => i.name));
  const hasAmounts = Object.keys(pattern.amounts ?? {}).length > 0;
  const ingredients = hasAmounts
    ? Object.entries(pattern.amounts).map(([name, qty]) => ({
      name, qty, have: inputNames.has(name),
    }))
    : (pattern.requiredIngredients ?? []).map((name) => ({
      name, qty: '適量', have: inputNames.has(name),
    }));

  return {
    title: pattern.name,
    time: pattern.time,
    diff: pattern.difficulty,
    category: category ?? pattern.categories?.[0] ?? 'おまかせ',
    description: `${pattern.method ?? '炒める'}で作る、${pattern.flavor ?? '和風'}味の一品です。`,
    ingredients,
    steps: makeStepsFromPattern(pattern),
    amounts: pattern.amounts ?? {},
    servings: pattern.servings,
    tone: 'amber',
  };
};

const nameOverlaps = (inputName, patternName) => (
  inputName === patternName
  || inputName.includes(patternName)
  || patternName.includes(inputName)
);

const makeMockRecipes = (ingredients, conditions = []) => {
  const selectedConditions = normalizeConditions(conditions);
  const inputNames = ingredients.map((i) => i.name);

  // recipePatterns から入力食材に合うものを探す（amounts入り優先）
  const scorePattern = (p) => {
    const overlap = (p.requiredIngredients ?? []).filter((req) =>
      inputNames.some((n) => nameOverlaps(n, req)),
    ).length;
    const hasAmounts = Object.keys(p.amounts ?? {}).length > 0 ? 1 : 0;
    return overlap * 2 + hasAmounts;
  };

  const ranked = recipePatterns
    .map((p) => ({ p, score: scorePattern(p) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length >= 2) {
    const [first, second] = ranked;
    return [
      patternToRecipe(first.p, ingredients, selectedConditions[0]),
      patternToRecipe(second.p, ingredients, selectedConditions[1] ?? selectedConditions[0]),
    ];
  }

  // パターンが1件しか見つからない場合は1件だけパターン使用、もう1件は汎用生成
  const names = inputNames;
  const main = names[0] ?? '野菜';
  const second = names[1] ?? names[0] ?? '食材';
  const third = names[2] ?? second;
  const firstCategory = selectedConditions[0] ?? 'おまかせ';
  const secondCategory = selectedConditions[1] ?? firstCategory;
  const firstPrefix = firstCategory === 'おまかせ' ? '' : `${firstCategory} `;
  const secondPrefix = secondCategory === 'おまかせ' ? '' : `${secondCategory} `;

  const genericRecipes = [
    {
      title: `${firstPrefix}${main}と${second}の香ばし炒め`,
      kana: firstCategory,
      category: firstCategory,
      time: 15,
      yen: 180,
      kcal: 420,
      diff: 'かんたん',
      tone: 'amber',
      tag: 'おすすめ',
      description: `${main}を中心に、冷蔵庫の材料だけで作る手早い炒めものです。しょうゆベースでごはんに合う味に仕上げます。`,
      ingredients: names.map((name) => ({ name, qty: '適量', have: true })),
      steps: [
        `${names.join('、')}を食べやすい大きさに切る。`,
        'フライパンに油を熱し、火の通りにくい材料から炒める。',
        'しょうゆ、みりん、少量の砂糖で味をととのえる。',
        '全体に味がなじんだら器に盛る。',
      ],
    },
    {
      title: `${secondPrefix}${main}と${third}のやさしい汁もの`,
      kana: secondCategory,
      category: secondCategory,
      time: 18,
      yen: 160,
      kcal: 260,
      diff: 'かんたん',
      tone: 'sage',
      description: '手元の材料をだしで煮る、あたたかい汁ものです。味噌やしょうゆで好みに合わせられます。',
      ingredients: names.map((name) => ({ name, qty: '適量', have: true })),
      steps: [
        '材料を食べやすい大きさに切る。',
        '鍋に水とだしを入れ、材料をやわらかくなるまで煮る。',
        '味噌またはしょうゆで味をととのえる。',
        '仕上げにこしょうやごま油を少量加える。',
      ],
    },
  ];

  if (ranked.length === 1) {
    return [
      patternToRecipe(ranked[0].p, ingredients, selectedConditions[0]),
      genericRecipes[1],
    ];
  }

  return genericRecipes;
};

const SCREENS = {
  onboarding: ScreenOnboarding,
  home: HomeA,
  camera: ScreenCamera,
  analyzing: ScreenAnalyzing,
  ingredients: ScreenIngredients,
  recipes: ScreenRecipes,
  detail: ScreenDetail,
  textInput: ScreenTextInput,
  saved: ScreenSaved,
  cooking: ScreenCooking,
  history: ScreenHistory,
  profile: ScreenProfile,
  admin: ScreenAdmin,
};

export default function App() {
  const { user, loading: authLoading, needsPasswordReset, signOut } = useAuth();
  const [screen, setScreen] = useState('onboarding');
  const [recipes, setRecipes] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedIngredients, setSubmittedIngredients] = useState([]);
  const [inputSource, setInputSource] = useState('text');
  const [completedRecipe, setCompletedRecipe] = useState(null);
  const [recentGenerations, setRecentGenerations] = useState(loadRecentGenerations);
  const [savedRecipes, setSavedRecipes] = useState(loadSavedRecipes);
  const [profile, setProfile] = useState(loadProfile);
  const [generationUsage, setGenerationUsage] = useState(loadGenerationUsage);
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [photoCount, setPhotoCount] = useState(0);
  const [photoAnalysisLoading, setPhotoAnalysisLoading] = useState(false);
  const [photoAnalysisError, setPhotoAnalysisError] = useState(null);
  const [generationConditions, setGenerationConditions] = useState(['おまかせ']);
  const [addingRecipes, setAddingRecipes] = useState(false);
  const [addError, setAddError] = useState(null);

  const navigate = (to) => setScreen(to);

  useEffect(() => {
    try {
      window.localStorage.setItem(SAVED_RECIPES_STORAGE_KEY, JSON.stringify(savedRecipes));
    } catch (error) {
      console.error('レシピ帳の保存に失敗しました', error);
    }
  }, [savedRecipes]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('プロフィールの保存に失敗しました', error);
    }
  }, [profile]);

  useEffect(() => {
    try {
      window.localStorage.setItem(GENERATIONS_STORAGE_KEY, JSON.stringify(recentGenerations));
    } catch (error) {
      console.error('生成履歴の保存に失敗しました', error);
    }
  }, [recentGenerations]);

  useEffect(() => {
    try {
      window.localStorage.setItem(GENERATION_USAGE_STORAGE_KEY, JSON.stringify(generationUsage));
    } catch (error) {
      console.error('生成回数の保存に失敗しました', error);
    }
  }, [generationUsage]);

  // ログイン時に Supabase からプランを取得・同期する
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;

    const syncProfile = async () => {
      try {
        const supabaseProfile = await fetchProfile(user.id);
        if (supabaseProfile) {
          // Supabase にプロフィールがある → プランを state に反映
          setProfile((current) => ({
            ...current,
            plan: supabaseProfile.plan ?? 'free',
          }));
        } else {
          // 初回ログイン → localStorage のプランで Supabase にプロフィールを作成
          const local = loadProfile();
          await upsertProfile(user.id, {
            email: user.email,
            display_name:
              user.user_metadata?.full_name
              ?? user.user_metadata?.name
              ?? user.email?.split('@')[0]
              ?? 'さくらこ',
            plan: local.plan ?? 'free',
          });
        }
      } catch (err) {
        console.error('プロフィール同期エラー', err);
      }
    };

    syncProfile();
  // user.id が変わったとき（ログイン・切替）のみ実行
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const dailyGenerationLimit = getGenerationLimit(profile);
  const isTester = profile.plan === 'tester';
  const generationStatus = {
    plan: profile.plan ?? 'free',
    used: generationUsage.count,
    limit: dailyGenerationLimit,
    remaining: isTester ? Infinity : Math.max(0, dailyGenerationLimit - generationUsage.count),
  };
  const isAdmin = user?.email === ADMIN_EMAIL;

  const rememberGeneration = ({ recipes: nextRecipes, ingredients, conditions }) => {
    if (!nextRecipes.length) return;

    const nextGeneration = makeGeneration({
      recipes: nextRecipes,
      ingredients,
      conditions,
    });

    setRecentGenerations((current) => {
      const next = [nextGeneration, ...current];
      return next.slice(0, RECENT_GENERATION_LIMIT);
    });
  };

  const consumeGeneration = () => {
    const todayKey = getTodayKey();
    const currentCount = generationUsage.date === todayKey ? generationUsage.count : 0;
    if (currentCount >= dailyGenerationLimit) return false;

    setGenerationUsage({ date: todayKey, count: currentCount + 1 });
    return true;
  };

  const addDetectedIngredients = (nextIngredients) => {
    setDetectedIngredients((current) => {
      const seen = new Set(current.map((item) => item.name));
      const additions = nextIngredients.filter((item) => !seen.has(item.name));
      return [...current, ...additions];
    });
  };

  const addMockPhotoIngredients = (selectedPhotoCount = 1) => {
    const batches = Array.from(
      { length: Math.max(1, selectedPhotoCount) },
      (_, index) => MOCK_PHOTO_BATCHES[(photoCount + index) % MOCK_PHOTO_BATCHES.length],
    ).flat();

    addDetectedIngredients(batches);
  };

  const handleAnalyzePhoto = async (selectedPhotos = 1) => {
    const photoFiles = Array.isArray(selectedPhotos) ? selectedPhotos : [];
    const selectedPhotoCount = photoFiles.length || Number(selectedPhotos) || 1;

    setPhotoCount((current) => current + Math.max(1, selectedPhotoCount));
    setPhotoAnalysisError(null);
    navigate('analyzing');

    if (!photoFiles.length) {
      addMockPhotoIngredients(selectedPhotoCount);
      return;
    }

    setPhotoAnalysisLoading(true);
    try {
      const result = await analyzeIngredientPhotos(photoFiles);
      if (result.ingredients?.length) {
        addDetectedIngredients(result.ingredients);
      } else {
        addMockPhotoIngredients(selectedPhotoCount);
        setPhotoAnalysisError('写真から食材を見つけられなかったため、サンプル食材で表示しています。');
      }
    } catch (apiError) {
      addMockPhotoIngredients(selectedPhotoCount);
      setPhotoAnalysisError(getPhotoFallbackMessage(apiError));
    } finally {
      setPhotoAnalysisLoading(false);
    }
  };

  const handleChangeDetectedIngredients = (nextIngredients) => {
    setDetectedIngredients(nextIngredients);
  };

  const handleUpdateProfile = (nextProfile) => {
    setProfile((current) => {
      const updated = { ...current, ...nextProfile };
      // Supabase にも保存
      if (user && isSupabaseConfigured) {
        upsertProfile(user.id, {
          email: user.email,
          display_name: nextProfile.name ?? updated.name,
          plan: nextProfile.plan ?? updated.plan,
        }).catch((err) => console.error('プロフィール保存エラー', err));
      }
      return updated;
    });
  };

  const handleGenerateRecipes = async (ingredients, source = 'text', conditions = ['おまかせ']) => {
    if (!ingredients.length) {
      setError('食材を1つ以上入力してください');
      return;
    }

    const selectedConditions = normalizeConditions(conditions);
    if (!consumeGeneration()) {
      setError(`今日の生成回数を使い切りました。無料は1日${FREE_DAILY_GENERATION_LIMIT}回、有料は1日${PAID_DAILY_GENERATION_LIMIT}回までです。`);
      setRecipes([]);
      setSubmittedIngredients(ingredients);
      setInputSource(source);
      setGenerationConditions(selectedConditions);
      navigate('recipes');
      return;
    }

    setLoading(true);
    setError(null);
    setAddError(null);
    setRecipes(null);
    setSelectedRecipe(null);
    setSubmittedIngredients(ingredients);
    setInputSource(source);
    setGenerationConditions(selectedConditions);
    navigate('recipes');

    try {
      const result = await fetchRecipes(ingredients.map((i) => i.name), selectedConditions);
      const generatedRecipes = limitGeneratedRecipes(result.recipes);
      setRecipes(generatedRecipes);
      rememberGeneration({ recipes: generatedRecipes, ingredients, conditions: selectedConditions });
    } catch (apiError) {
      const mockRecipes = makeMockRecipes(ingredients, selectedConditions);
      setRecipes(mockRecipes);
      rememberGeneration({ recipes: mockRecipes, ingredients, conditions: selectedConditions });
      setError(getApiFallbackMessage(apiError));
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecipes = async (conditions = generationConditions) => {
    if (!submittedIngredients.length) {
      setAddError('食材を1つ以上入力してください');
      navigate('textInput');
      return;
    }

    setAddingRecipes(true);
    setAddError(null);

    const existingRecipes = recipes ?? [];
    const existingTitles = existingRecipes.map((recipe) => recipe.title).filter(Boolean);
    const selectedConditions = normalizeConditions(conditions);
    const mockConditions = selectedConditions[0] === 'おまかせ'
      ? [`別案${Math.floor(existingRecipes.length / 2) + 1}`]
      : selectedConditions;

    if (!consumeGeneration()) {
      setAddingRecipes(false);
      setAddError(`今日の生成回数を使い切りました。無料は1日${FREE_DAILY_GENERATION_LIMIT}回、有料は1日${PAID_DAILY_GENERATION_LIMIT}回までです。`);
      return;
    }

    try {
      const result = await fetchRecipes(
        submittedIngredients.map((i) => i.name),
        selectedConditions,
        existingTitles,
      );
      const { merged, added } = mergeUniqueRecipes(existingRecipes, limitGeneratedRecipes(result.recipes));
      setRecipes(merged);
      rememberGeneration({ recipes: added, ingredients: submittedIngredients, conditions: selectedConditions });
      if (!added.length) {
        setAddError('似たタイトルの提案だったため、重複分は追加しませんでした。');
      }
    } catch (apiError) {
      const mockRecipes = makeMockRecipes(submittedIngredients, mockConditions);
      const { merged, added } = mergeUniqueRecipes(existingRecipes, mockRecipes);
      setRecipes(merged);
      rememberGeneration({ recipes: added, ingredients: submittedIngredients, conditions: selectedConditions });
      setAddError(getApiFallbackMessage(apiError, 'add'));
    } finally {
      setAddingRecipes(false);
    }
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    navigate('detail');
  };

  const handleSelectGeneration = (generation) => {
    setRecipes(generation.recipes ?? []);
    setSubmittedIngredients(generation.ingredients ?? []);
    setGenerationConditions(generation.conditions ?? ['おまかせ']);
    setInputSource('text');
    setSelectedRecipe(null);
    setError(null);
    setAddError(null);
    navigate('recipes');
  };

  const handleToggleFavorite = (recipe) => {
    if (!recipe?.title) return;

    setSavedRecipes((current) => {
      const recipeKey = normalizeTitle(recipe.title);
      const existing = current.find((item) => normalizeTitle(item.title) === recipeKey);

      if (existing?.favoritedAt) {
        if (existing.completedCount || existing.lastCompletedAt) {
          return current.map((item) => {
            if (normalizeTitle(item.title) !== recipeKey) return item;
            const nextItem = { ...item };
            delete nextItem.favoritedAt;
            return nextItem;
          });
        }

        return current.filter((item) => normalizeTitle(item.title) !== recipeKey);
      }

      if (existing) {
        return current.map((item) => (
          normalizeTitle(item.title) === recipeKey
            ? { ...item, ...recipe, favoritedAt: new Date().toISOString() }
            : item
        ));
      }

      return [
        {
          ...recipe,
          savedAt: new Date().toISOString(),
          favoritedAt: new Date().toISOString(),
          completedCount: 0,
        },
        ...current,
      ];
    });
  };

  const handleCompleteRecipe = (recipe) => {
    const completed = recipe ? { ...recipe, completedAt: new Date().toISOString() } : null;
    setCompletedRecipe(completed);
    if (completed) {
      setSavedRecipes((current) => {
        const completedKey = normalizeTitle(completed.title);
        const existing = current.find((item) => normalizeTitle(item.title) === completedKey);
        if (existing) {
          return current.map((item) => (
            normalizeTitle(item.title) === completedKey
              ? {
                ...item,
                ...completed,
                savedAt: item.savedAt ?? completed.completedAt,
                completedCount: (item.completedCount ?? 1) + 1,
                lastCompletedAt: completed.completedAt,
              }
              : item
          ));
        }

        return [
          {
            ...completed,
            savedAt: completed.completedAt,
            completedCount: 1,
            lastCompletedAt: completed.completedAt,
          },
          ...current,
        ];
      });
    }
    navigate('home');
  };

  const effectiveScreen = (!authLoading && user && screen === 'onboarding') ? 'home' : screen;
  const CurrentScreen = SCREENS[effectiveScreen] || SCREENS.home;

  // Supabase ユーザー情報をプロフィールにマージ
  const displayProfile = {
    ...profile,
    name: user?.user_metadata?.full_name
      ?? user?.user_metadata?.name
      ?? user?.email?.split('@')[0]
      ?? profile.name,
    avatarUrl: user?.user_metadata?.avatar_url
      ?? user?.user_metadata?.picture
      ?? null,
  };

  // 外枠（モックフォン）共通スタイル
  const phoneShell = {
    width: 390,
    height: 844,
    borderRadius: 44,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 40px 80px rgba(0,0,0,0.6)',
    flexShrink: 0,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a140e',
        padding: '20px 0',
      }}
    >
      {/* 認証状態の読み込み中 */}
      {authLoading && (
        <div style={phoneShell}>
          <div style={{
            width: '100%', height: '100%', background: T.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 16,
          }}>
            <div style={{ fontSize: 40 }}>🥢</div>
            <div style={{ fontFamily: FONT.sans, fontSize: 13, color: T.inkMuted }}>
              読み込み中…
            </div>
          </div>
        </div>
      )}

      {/* 未ログイン → オンボーディング画面 */}
      {!authLoading && !user && (
        <div style={phoneShell}>
          <ScreenOnboarding />
        </div>
      )}

      {/* パスワードリセットリンクからの遷移 → 新パスワード設定画面 */}
      {!authLoading && user && needsPasswordReset && (
        <div style={phoneShell}>
          <ScreenPasswordReset />
        </div>
      )}

      {/* ログイン済み（通常） → 通常のアプリ */}
      {!authLoading && user && !needsPasswordReset && (
        <div style={phoneShell}>
          <CurrentScreen
            navigate={navigate}
            recipes={recipes}
            loading={loading}
            error={error}
            addError={addError}
            selectedRecipe={selectedRecipe}
            completedRecipe={completedRecipe}
            profile={displayProfile}
            recentGenerations={recentGenerations}
            savedRecipes={savedRecipes}
            generationStatus={generationStatus}
            detectedIngredients={detectedIngredients}
            photoCount={photoCount}
            photoAnalysisLoading={photoAnalysisLoading}
            photoAnalysisError={photoAnalysisError}
            ingredients={submittedIngredients}
            inputSource={inputSource}
            generationLabel={getConditionLabel(generationConditions)}
            addingRecipes={addingRecipes}
            onGenerateRecipes={handleGenerateRecipes}
            onAddRecipes={handleAddRecipes}
            onAnalyzePhoto={handleAnalyzePhoto}
            onChangeDetectedIngredients={handleChangeDetectedIngredients}
            isAdmin={isAdmin}
            onUpdateProfile={handleUpdateProfile}
            onSelectRecipe={handleSelectRecipe}
            onSelectGeneration={handleSelectGeneration}
            onToggleFavorite={handleToggleFavorite}
            onCompleteRecipe={handleCompleteRecipe}
            onSignOut={signOut}
          />
        </div>
      )}
    </div>
  );
}
