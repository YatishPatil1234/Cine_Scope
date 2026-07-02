const KEY     = "cs_recently_watched";
const MAX     = 20; // keep last 20 items

/**
 * @typedef {{ id: number, title: string, poster_path: string|null,
 *             vote_average: number, release_date: string,
 *             mediaType: "movie"|"tv", visitedAt: number }} RecentItem
 */

/** @returns {RecentItem[]} */
export function getRecentlyWatched() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

/** @param {RecentItem} item */
export function addRecentlyWatched(item) {
  if (typeof window === "undefined") return;
  try {
    const prev    = getRecentlyWatched();
    const without = prev.filter((i) => !(i.id === item.id && i.mediaType === item.mediaType));
    const next    = [{ ...item, visitedAt: Date.now() }, ...without].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}

export function clearRecentlyWatched() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
