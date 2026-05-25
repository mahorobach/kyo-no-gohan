export const GEMINI_MODEL = 'gemini-3.1-flash-lite';

export const getGeminiApiKey = (env) => String(env.GEMINI_API_KEY ?? '')
  .trim()
  .replace(/^GEMINI_API_KEY=/, '')
  .trim();

export const getGeminiGenerateContentUrl = () => (
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
);
