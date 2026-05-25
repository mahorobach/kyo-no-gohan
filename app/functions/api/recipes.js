const API_MODEL = 'gemini-3.5-flash';
const REQUEST_TIMEOUT_MS = 20000;

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

const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
});

const parseRecipes = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error(`パース失敗: ${text.slice(0, 100)}`);
  }

  const parsed = JSON.parse(match[0]);
  if (!Array.isArray(parsed.recipes)) {
    throw new Error('recipes array was not returned');
  }
  return parsed;
};

export async function onRequestPost({ request, env }) {
  if (!env.GEMINI_API_KEY) {
    return jsonResponse({ error: 'GEMINI_API_KEY is not configured' }, 500);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const ingredientNames = Array.isArray(payload.ingredientNames)
    ? payload.ingredientNames.map((name) => String(name).trim()).filter(Boolean)
    : [];
  const condition = typeof payload.condition === 'string' ? payload.condition.trim() : '';
  const avoidTitles = Array.isArray(payload.avoidTitles)
    ? payload.avoidTitles.map((title) => String(title).trim()).filter(Boolean)
    : [];

  if (!ingredientNames.length) {
    return jsonResponse({ error: '食材を1つ以上入力してください' }, 400);
  }

  const conditionText = condition ? `\n追加条件: ${condition}を優先してください。` : '';
  const avoidTitleText = avoidTitles.length
    ? `\n既存の料理名: ${avoidTitles.join('、')}\n上記と同じ、またはほぼ同じ料理名は避けてください。`
    : '';
  const userMessage = `以下の食材でレシピを3つ提案してください：${ingredientNames.join('、')}${conditionText}${avoidTitleText}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${API_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const msg = errBody?.error?.message ?? res.status;
      return jsonResponse({ error: `Gemini API error: ${msg}` }, 502);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return jsonResponse(parseRecipes(text));
  } catch (error) {
    if (error.name === 'AbortError') {
      return jsonResponse({ error: 'Gemini API request timed out' }, 504);
    }
    return jsonResponse({ error: error.message ?? 'Unexpected API error' }, 500);
  } finally {
    clearTimeout(timeoutId);
  }
}
