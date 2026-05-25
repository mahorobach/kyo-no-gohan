import { useEffect, useState } from 'react';
import ScreenOnboarding from './screens/ScreenOnboarding';
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

const RECENT_RECIPE_LIMIT = 12;
const SAVED_RECIPES_STORAGE_KEY = 'kyou-no-gohan:saved-recipes';
const PROFILE_STORAGE_KEY = 'kyou-no-gohan:profile';

const normalizeTitle = (title = '') => title.replace(/\s+/g, '').trim();

const MOCK_PHOTO_BATCHES = [
  [
    { k: 'onion', name: '玉ねぎ', qty: '2個', conf: 98 },
    { k: 'pork', name: '豚バラ肉', qty: '約 200g', conf: 95 },
    { k: 'pepper', name: 'ピーマン', qty: '4個', conf: 91 },
  ],
  [
    { k: 'ginger', name: '生姜', qty: '1かけ', conf: 88 },
    { k: 'carrot', name: '人参', qty: '1本', conf: 84 },
    { k: 'egg', name: '卵', qty: '6個', conf: 92, low: true },
  ],
  [
    { k: 'tofu', name: '豆腐', qty: '1丁', conf: 90 },
    { k: 'sprouts', name: 'もやし', qty: '1袋', conf: 86 },
    { k: 'miso', name: 'みそ', qty: '少し', conf: 82 },
  ],
  [
    { k: 'tomato', name: 'トマト', qty: '2個', conf: 87 },
    { k: 'chicken', name: '鶏肉', qty: '約 250g', conf: 85 },
    { k: 'leek', name: 'ねぎ', qty: '1本', conf: 83 },
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

const loadProfile = () => {
  try {
    const profileText = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!profileText) return { name: 'さくらこ' };

    const parsed = JSON.parse(profileText);
    return {
      name: typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim() : 'さくらこ',
    };
  } catch (error) {
    console.error('プロフィールの読み込みに失敗しました', error);
    return { name: 'さくらこ' };
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

const makeMockRecipes = (ingredients, conditions = []) => {
  const selectedConditions = normalizeConditions(conditions);
  const names = ingredients.map((i) => i.name);
  const main = names[0] ?? '野菜';
  const second = names[1] ?? names[0] ?? '食材';
  const third = names[2] ?? second;
  const firstCategory = selectedConditions[0] ?? 'おまかせ';
  const secondCategory = selectedConditions[1] ?? firstCategory;
  const firstPrefix = firstCategory === 'おまかせ' ? '' : `${firstCategory} `;
  const secondPrefix = secondCategory === 'おまかせ' ? '' : `${secondCategory} `;

  return [
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
};

export default function App() {
  const [screen, setScreen] = useState('onboarding');
  const [recipes, setRecipes] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedIngredients, setSubmittedIngredients] = useState([]);
  const [inputSource, setInputSource] = useState('text');
  const [completedRecipe, setCompletedRecipe] = useState(null);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState(loadSavedRecipes);
  const [profile, setProfile] = useState(loadProfile);
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

  const rememberRecipes = (nextRecipes) => {
    setRecentRecipes((current) => {
      const merged = [...nextRecipes, ...current];
      const unique = [];
      const seenTitles = new Set();
      merged.forEach((recipe) => {
        const key = normalizeTitle(recipe.title);
        if (key && !seenTitles.has(key)) {
          seenTitles.add(key);
          unique.push(recipe);
        }
      });
      return unique.slice(0, RECENT_RECIPE_LIMIT);
    });
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
    setProfile((current) => ({ ...current, ...nextProfile }));
  };

  const handleGenerateRecipes = async (ingredients, source = 'text', conditions = ['おまかせ']) => {
    if (!ingredients.length) {
      setError('食材を1つ以上入力してください');
      return;
    }

    const selectedConditions = normalizeConditions(conditions);
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
      setRecipes(result.recipes);
      rememberRecipes(result.recipes);
    } catch (apiError) {
      const mockRecipes = makeMockRecipes(ingredients, selectedConditions);
      setRecipes(mockRecipes);
      rememberRecipes(mockRecipes);
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

    try {
      const result = await fetchRecipes(
        submittedIngredients.map((i) => i.name),
        selectedConditions,
        existingTitles,
      );
      const { merged, added } = mergeUniqueRecipes(existingRecipes, result.recipes);
      setRecipes(merged);
      rememberRecipes(added);
      if (!added.length) {
        setAddError('似たタイトルの提案だったため、重複分は追加しませんでした。');
      }
    } catch (apiError) {
      const mockRecipes = makeMockRecipes(submittedIngredients, mockConditions);
      const { merged, added } = mergeUniqueRecipes(existingRecipes, mockRecipes);
      setRecipes(merged);
      rememberRecipes(added);
      setAddError(getApiFallbackMessage(apiError, 'add'));
    } finally {
      setAddingRecipes(false);
    }
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    navigate('detail');
  };

  const handleCompleteRecipe = (recipe) => {
    const completed = recipe ? { ...recipe, completedAt: new Date().toISOString() } : null;
    setCompletedRecipe(completed);
    if (completed) {
      rememberRecipes([completed]);
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

  const CurrentScreen = SCREENS[screen] || SCREENS.home;

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
      <div
        style={{
          width: 390,
          height: 844,
          borderRadius: 44,
          overflow: 'hidden',
          position: 'relative',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.08), 0 40px 80px rgba(0,0,0,0.6)',
          flexShrink: 0,
        }}
      >
        <CurrentScreen
          navigate={navigate}
          recipes={recipes}
          loading={loading}
          error={error}
          addError={addError}
          selectedRecipe={selectedRecipe}
          completedRecipe={completedRecipe}
          profile={profile}
          recentRecipes={recentRecipes}
          savedRecipes={savedRecipes}
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
          onUpdateProfile={handleUpdateProfile}
          onSelectRecipe={handleSelectRecipe}
          onCompleteRecipe={handleCompleteRecipe}
        />
      </div>
    </div>
  );
}
