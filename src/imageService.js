/**
 * Image service — tries providers in priority order:
 * 1. Unsplash API  (VITE_UNSPLASH_ACCESS_KEY)  — best quality, needs approval
 * 2. Pexels API    (VITE_PEXELS_API_KEY)        — instant free key at pexels.com/api
 * 3. source.unsplash.com                         — no key, deprecated fallback
 */

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const PEXELS_KEY   = import.meta.env.VITE_PEXELS_API_KEY;
const cache = new Map();

async function tryUnsplash(query, orientation) {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=${orientation}&content_filter=high`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
  );
  if (!res.ok) throw new Error("Unsplash error");
  const data = await res.json();
  const photo = data.results?.[0];
  if (!photo) throw new Error("No results");
  return photo.urls.regular;
}

async function tryPexels(query) {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    { headers: { Authorization: PEXELS_KEY } }
  );
  if (!res.ok) throw new Error("Pexels error");
  const data = await res.json();
  const photo = data.photos?.[0];
  if (!photo) throw new Error("No results");
  return photo.src.large;
}

export async function fetchUnsplashUrl(query, orientation = "landscape") {
  const cacheKey = `${query}__${orientation}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  let url = null;

  if (UNSPLASH_KEY) {
    try { url = await tryUnsplash(query, orientation); } catch {}
  }

  if (!url && PEXELS_KEY) {
    try { url = await tryPexels(query); } catch {}
  }

  if (!url) {
    url = `https://source.unsplash.com/1200x500/?${encodeURIComponent(query)}`;
  }

  cache.set(cacheKey, url);
  return url;
}
