"use client";

/**
 * Lightweight localStorage cache with TTL.
 *
 * Purpose: every client-side fetch (OMDB ratings, watch providers,
 * recommendations, search, mood picks, discover pages...) hits a Vercel
 * Edge Function. Repeat visits to the same movie/page from the same
 * browser used to re-fire all of those requests. Caching them client-side
 * means a returning visitor costs ZERO additional function invocations
 * until the TTL expires — this is the single biggest lever for cutting
 * Vercel/Netlify usage on a content site like this.
 */

const PREFIX = "cs_cache:";
const MAX_ENTRIES = 200; // basic guard against unbounded localStorage growth

function safeParse(raw) {
  try { return JSON.parse(raw); } catch { return null; }
}

export function cacheGet(key) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const entry = safeParse(raw);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(PREFIX + key);
      return null;
    }
    return entry.value;
  } catch {
    return null;
  }
}

export function cacheSet(key, value, ttlMs) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      PREFIX + key,
      JSON.stringify({ value, expiresAt: Date.now() + ttlMs }),
    );
  } catch {
    // Quota exceeded or private browsing — evict oldest cache entries and retry once
    try {
      evictOldest();
      localStorage.setItem(
        PREFIX + key,
        JSON.stringify({ value, expiresAt: Date.now() + ttlMs }),
      );
    } catch {
      /* give up silently — caching is a best-effort optimization */
    }
  }
}

function evictOldest() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k?.startsWith(PREFIX)) keys.push(k);
  }
  if (keys.length <= MAX_ENTRIES) {
    // Just clear a handful to free space
    keys.slice(0, 20).forEach((k) => localStorage.removeItem(k));
    return;
  }
  keys.slice(0, keys.length - MAX_ENTRIES + 20).forEach((k) => localStorage.removeItem(k));
}

/** Common TTL presets (ms) */
export const TTL = {
  HOUR:      60 * 60 * 1000,
  HALF_DAY:  12 * 60 * 60 * 1000,
  DAY:       24 * 60 * 60 * 1000,
  WEEK:      7 * 24 * 60 * 60 * 1000,
};

/**
 * Fetch JSON with a cache-first strategy.
 * Returns cached value instantly (no network) if still fresh.
 */
export async function cachedFetchJSON(url, { ttl = TTL.DAY, cacheKey } = {}) {
  const key = cacheKey ?? url;
  const cached = cacheGet(key);
  if (cached !== null) return cached;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const data = await res.json();
  cacheSet(key, data, ttl);
  return data;
}
