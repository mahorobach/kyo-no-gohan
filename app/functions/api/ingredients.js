import { GEMINI_MODEL, getGeminiApiKey, getGeminiGenerateContentUrl } from '../_shared/gemini.js';

const MAX_IMAGES = 5;

const INGREDIENT_KEYS = [
  'onion',
  'carrot',
  'pork',
  'chicken',
  'egg',
  'tofu',
  'cabbage',
  'pepper',
  'tomato',
  'milk',
  'sprouts',
  'leek',
  'miso',
  'ginger',
  'garlic',
  'rice',
];

const SYSTEM_PROMPT = `あなたは冷蔵庫写真から食材を見つける日本の家庭料理アシスタントです。
画像に写っている食材だけを抽出してください。

ルール：
- 食材名は日本語で短く返す。
- 分量は見た目から推定できる範囲で「約 200g」「2個」「1袋」「少し」などにする。
- 確信度は0〜100の整数にする。
- k は次の候補から近いものを1つ選ぶ。該当がなければ onion を選ぶ。
${INGREDIENT_KEYS.join(', ')}
- 必ずJSONのみで返す。説明文・マークダウン記法は不要。

返答形式：
{
  "ingredients": [
    { "k": "onion", "name": "玉ねぎ", "qty": "2個", "conf": 92 }
  ]
}`;

const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
});

const parseIngredients = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error(`パース失敗: ${text.slice(0, 100)}`);
  }

  const parsed = JSON.parse(match[0]);
  if (!Array.isArray(parsed.ingredients)) {
    throw new Error('ingredients array was not returned');
  }

  const ingredients = parsed.ingredients
    .map((item) => {
      const name = String(item.name ?? '').trim();
      if (!name) return null;

      const k = INGREDIENT_KEYS.includes(item.k) ? item.k : 'onion';
      const qty = String(item.qty ?? '適量').trim() || '適量';
      const conf = Number.isFinite(Number(item.conf))
        ? Math.max(0, Math.min(100, Math.round(Number(item.conf))))
        : 70;

      return { k, name, qty, conf };
    })
    .filter(Boolean);

  return { ingredients };
};

export async function onRequestPost({ request, env }) {
  try {
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

    const images = Array.isArray(payload.images)
      ? payload.images.slice(0, MAX_IMAGES).filter((image) => (
        typeof image?.mimeType === 'string'
        && image.mimeType.startsWith('image/')
        && typeof image?.data === 'string'
        && image.data.length > 0
      ))
      : [];

    if (!images.length) {
      return jsonResponse({ error: '写真を1枚以上選んでください' }, 400);
    }

    const parts = [
      { text: 'この写真に写っている食材を抽出してください。複数枚ある場合は重複をまとめてください。' },
      ...images.map((image) => ({
        inline_data: {
          mime_type: image.mimeType,
          data: image.data,
        },
      })),
    ];

    const res = await fetch(getGeminiGenerateContentUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
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
    return jsonResponse(parseIngredients(text));
  } catch (error) {
    return jsonResponse({ error: error.message ?? 'Unexpected API error' }, 500);
  }
}

export async function onRequestGet() {
  return jsonResponse({ ok: true, model: GEMINI_MODEL });
}
