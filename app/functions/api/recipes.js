import { GEMINI_MODEL, getGeminiApiKey, getGeminiGenerateContentUrl } from '../_shared/gemini.js';

const SYSTEM_PROMPT = `あなたは日本の家庭料理に精通したプロシェフです。
ユーザーから食材リストと生成条件が与えられます。以下の条件で2つのレシピを考えてください。

【絶対ルール】
- 使える食材は「入力された食材」と「以下の調味料」のみ。それ以外は一切使わないこと。
- 追加できる調味料（これ以外は不可）: 塩、砂糖、醤油、みりん、酒、味噌、油（サラダ油・ごま油・オリーブ油）、酢、こしょう、だし（顆粒・昆布・かつお）、片栗粉、小麦粉、バター、ケチャップ、マヨネーズ、ソース
- 上記以外の食材（塩昆布・めんつゆ・豆板醤・コチュジャン・ナンプラー・オイスターソースなど）は、入力リストにない限り使用禁止。
- 料理名（title）に使う食材名は、必ず ingredients リストに含まれているものだけを使うこと。料理名と食材リストが一致しない場合は絶対に認めない。

【生成条件】
- 生成条件が1つだけの場合、その条件に合うレシピを2つ返す。
- 生成条件が2つある場合、1つ目の条件に合うレシピを1つ、2つ目の条件に合うレシピを1つ返す。
- 生成条件が「おまかせ」または未指定の場合、家庭で作りやすい方向で2つ返す。

共通ルール：
- 味付けは日本の家庭料理に合うものにすること。
- 各レシピには、該当する生成条件を category に入れること。
- 手順（steps）は料理の複雑さに応じて4〜6ステップで書くこと。標準的な料理は4〜5、工程が多い料理は6にすること。必ず4ステップにそろえなくてよい。
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
      "category": "おまかせ または 指定された生成条件",
      "description": "料理の説明（2文以内）",
      "ingredients": [
        { "name": "入力された食材名", "qty": "分量", "have": true },
        { "name": "追加した調味料名", "qty": "分量", "have": false }
      ],
      "steps": ["手順1", "手順2", "手順3", "手順4", "手順5（複雑な料理はここまで）", "手順6（必要な場合のみ）"]
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
  parsed.recipes = parsed.recipes.slice(0, 2);
  return parsed;
};

export async function onRequestPost({ request, env }) {
  try {
    const requestUrl = new URL(request.url);
    if (requestUrl.searchParams.get('health') === '1') {
      return jsonResponse({ ok: true, model: GEMINI_MODEL });
    }

    const apiKey = getGeminiApiKey(env);
    if (!apiKey) {
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
    const conditions = Array.isArray(payload.conditions)
      ? payload.conditions.map((item) => String(item).trim()).filter(Boolean).slice(0, 2)
      : condition ? [condition] : [];
    const avoidTitles = Array.isArray(payload.avoidTitles)
      ? payload.avoidTitles.map((title) => String(title).trim()).filter(Boolean)
      : [];

    if (!ingredientNames.length) {
      return jsonResponse({ error: '食材を1つ以上入力してください' }, 400);
    }

    const conditionText = conditions.length
      ? `\n生成条件: ${conditions.join('、')}`
      : '\n生成条件: おまかせ';
    const avoidTitleText = avoidTitles.length
      ? `\n既存の料理名: ${avoidTitles.join('、')}\n上記と同じ、またはほぼ同じ料理名は避けてください。`
      : '';
    const userMessage = `以下の食材でレシピを2つ提案してください：${ingredientNames.join('、')}${conditionText}${avoidTitleText}`;

    const apiUrl = getGeminiGenerateContentUrl();
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const msg = errBody?.error?.message ?? res.status;
      return jsonResponse(
        {
          error: `Gemini API error: ${msg}`,
          status: errBody?.error?.status,
        },
        res.status === 429 ? 429 : 500,
      );
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return jsonResponse(parseRecipes(text));
  } catch (error) {
    return jsonResponse({ error: error.message ?? 'Unexpected API error' }, 500);
  }
}

export async function onRequestGet() {
  return jsonResponse({ ok: true, model: GEMINI_MODEL });
}
