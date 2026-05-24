const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`;
const IMAGE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent';
const REQUEST_TIMEOUT_MS = 20000;
const IMAGE_REQUEST_TIMEOUT_MS = 45000;

const SYSTEM_PROMPT = `あなたは日本の家庭料理に精通したプロシェフです。
ユーザーから食材リストが与えられます。以下の条件で3つのレシピを考えてください。

【絶対ルール】
- 3つすべてのレシピで、使える食材は入力された食材のみ。
- それ以外の野菜・肉・魚・豆腐・きのこ・乳製品などは一切追加しないこと。
- 調味料（塩、砂糖、醤油、みりん、酒、味噌、油、酢、こしょう、だし、片栗粉など）のみ自由に使ってよい。

【レシピ1】炒め物・焼き物系
- 入力された食材を使った炒め物または焼き物のレシピ。

【レシピ2】煮物・汁物系
- 入力された食材を使った煮物または汁物のレシピ。

【レシピ3】丼・ご飯物またはその他
- 入力された食材を使った丼、ご飯物、または上記以外のジャンルのレシピ。

共通ルール：
- 味付けは日本の家庭料理に合うものにすること。
- 必ず以下のJSON形式のみで返答すること。説明文・マークダウン記法は不要。

返答形式（JSONのみ）：
{
  "recipes": [
    {
      "title": "料理名",
      "kana": "サブタイトル（例：ごはんがすすむ）",
      "time": 調理時間（数値・分）,
      "yen": 一人あたりコスト（数値・円）,
      "kcal": カロリー（数値）,
      "diff": "かんたん または ふつう または むずかしい",
      "description": "料理の説明（2文以内）",
      "ingredients": [
        { "name": "食材名", "qty": "分量", "have": true, "extra": false }
      ],
      "steps": ["手順1", "手順2", "手順3", "手順4"]
    }
  ]
}`;

export async function fetchRecipes(ingredientNames, condition = '', avoidTitles = []) {
  const conditionText = condition ? `\n追加条件: ${condition}を優先してください。` : '';
  const avoidTitleText = avoidTitles.length
    ? `\n既存の料理名: ${avoidTitles.join('、')}\n上記と同じ、またはほぼ同じ料理名は避けてください。`
    : '';
  const userMessage = `以下の食材でレシピを3つ提案してください：${ingredientNames.join('、')}${conditionText}${avoidTitleText}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
      }),
    });
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error('API request timed out', { cause: e });
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const msg = errBody?.error?.message ?? res.status;
    throw new Error(`API error: ${msg}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  // JSONブロックを抽出
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`パース失敗: ${text.slice(0, 100)}`);

  return JSON.parse(match[0]);
}

export async function generateRecipeImage(recipe) {
  if (!API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const ingredientNames = recipe.ingredients?.map((it) => it.name).join('、') ?? '';
  const prompt = `日本の家庭料理の完成写真を1枚生成してください。
料理名: ${recipe.title}
主な材料: ${ingredientNames}
条件:
- 実写風の自然な料理写真
- 白い器または素朴な和食器に盛り付け
- 清潔な食卓、自然光
- 文字、ロゴ、人物、手は入れない
- 材料と料理名から想像できる見た目にする`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), IMAGE_REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(IMAGE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY,
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ['Image'],
          responseFormat: {
            image: {
              aspectRatio: '4:3',
              imageSize: '1K',
            },
          },
        },
      }),
    });
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error('Image API request timed out', { cause: e });
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const msg = errBody?.error?.message ?? res.status;
    throw new Error(`Image API error: ${msg}`);
  }

  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((part) => part.inlineData?.data || part.inline_data?.data);
  const inlineData = imagePart?.inlineData ?? imagePart?.inline_data;

  if (!inlineData?.data) {
    throw new Error('Image data was not returned');
  }

  return `data:${inlineData.mimeType ?? inlineData.mime_type ?? 'image/png'};base64,${inlineData.data}`;
}
