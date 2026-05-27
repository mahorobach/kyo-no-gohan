// レシピデータから料理イラスト画像のパスを返すユーティリティ
// 優先順位: 調理法 → カテゴリ → 条件 → 食材 → タイトル → デフォルト

const METHOD_MAP = [
  [['炒める'], 'stir-fry'],
  [['煮る', '煮込む', '蒸し煮'], 'simmered'],
  [['揚げる', '素揚げ'], 'deep-fried'],
  [['蒸す'], 'steamed'],
  [['焼く', 'グリル', '炙る'], 'grilled'],
  [['和える', '混ぜる', '漬ける'], 'dressed'],
];

const CATEGORY_MAP = [
  [['中華'], 'chinese'],
  [['和風', '和食'], 'japanese'],
  [['ヘルシー', 'ダイエット'], 'healthy'],
  [['お弁当', '弁当'], 'bento'],
  [['汁物', 'スープ', 'みそ汁'], 'soup'],
];

// Gemini 生成レシピの category（単文字列）用
const CONDITION_MAP = [
  [['時短', 'お手軽', '簡単'], 'quick'],
  [['がっつり'], 'hearty'],
  [['やさしい', 'さっぱり', 'あっさり'], 'gentle'],
  [['節約'], 'budget'],
  [['汁物', 'みそ汁', 'スープ'], 'soup'],
  [['お弁当', '弁当'], 'bento'],
];

const TITLE_MAP = [
  [['炒め'], 'stir-fry'],
  [['煮', '煮物', '煮込み'], 'simmered'],
  [['揚げ', '天ぷら', '唐揚げ'], 'deep-fried'],
  [['蒸し'], 'steamed'],
  [['焼き', '焼'], 'grilled'],
  [['和え'], 'dressed'],
  [['汁', 'みそ汁', 'スープ'], 'soup'],
  [['丼', 'ご飯'], 'rice-bowl'],
  [['麻婆', '豆腐'], 'tofu-dish'],
  [['ソイミート'], 'soy-meat'],
];

const match = (text, keywords) => keywords.some(k => text.includes(k));

export const getDishImage = (recipe = {}) => {
  if (!recipe) return '/images/dishes/default.svg';

  // 1. 調理法（recipePatterns.method）
  const method = recipe.method ?? '';
  if (method) {
    for (const [keywords, img] of METHOD_MAP) {
      if (match(method, keywords)) return `/images/dishes/${img}.svg`;
    }
  }

  // 2. カテゴリ配列（recipePatterns.categories）
  const cats = recipe.categories ?? [];
  for (const [keywords, img] of CATEGORY_MAP) {
    if (cats.some(c => match(c, keywords))) return `/images/dishes/${img}.svg`;
  }

  // 3. 生成条件（Gemini recipe.category）
  const cat = recipe.category ?? '';
  for (const [keywords, img] of CONDITION_MAP) {
    if (match(cat, keywords)) return `/images/dishes/${img}.svg`;
  }

  // 4. 食材名（ingredients / amounts）
  const ingredientText = [
    ...(recipe.ingredients?.map(i => i.name) ?? []),
    ...Object.keys(recipe.amounts ?? {}),
  ].join('');

  if (ingredientText.includes('ソイミート')) return '/images/dishes/soy-meat.svg';
  if (ingredientText.includes('豆腐')) return '/images/dishes/tofu-dish.svg';

  // 5. タイトルの語尾・キーワード
  const title = recipe.title ?? '';
  for (const [keywords, img] of TITLE_MAP) {
    if (match(title, keywords)) return `/images/dishes/${img}.svg`;
  }

  return '/images/dishes/default.svg';
};
