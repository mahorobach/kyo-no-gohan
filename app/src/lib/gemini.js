const REQUEST_TIMEOUT_MS = 20000;

export async function fetchRecipes(ingredientNames, condition = '', avoidTitles = []) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ ingredientNames, condition, avoidTitles }),
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
    const msg = errBody?.error ?? res.status;
    throw new Error(`API error: ${msg}`);
  }

  return res.json();
}

export async function generateRecipeImage() {
  throw new Error('Recipe image generation is disabled');
}
