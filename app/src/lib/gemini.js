const REQUEST_TIMEOUT_MS = 20000;

const readImageFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    const result = typeof reader.result === 'string' ? reader.result : '';
    const data = result.includes(',') ? result.split(',').pop() : result;
    resolve({
      mimeType: file.type || 'image/jpeg',
      data,
    });
  };
  reader.onerror = () => reject(new Error('写真の読み込みに失敗しました'));
  reader.readAsDataURL(file);
});

export async function fetchRecipes(ingredientNames, conditions = [], avoidTitles = []) {
  const selectedConditions = Array.isArray(conditions)
    ? conditions
    : conditions ? [conditions] : [];
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ ingredientNames, conditions: selectedConditions, avoidTitles }),
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

export async function analyzeIngredientPhotos(files) {
  const images = await Promise.all(Array.from(files).map(readImageFile));
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ images }),
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
