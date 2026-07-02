/**
 * "My Lists" — multiple named watchlists stored in localStorage.
 *
 * Schema:
 *   cs_lists: { [listId: string]: { id, name, color, items: Item[] } }
 *   cs_ratings: { [mediaType-id]: { rating: 1-5, note: string, ratedAt: number } }
 */

// ─── Lists ───────────────────────────────────────────────────────────────────

const LISTS_KEY   = "cs_lists";
const RATINGS_KEY = "cs_ratings";

export const DEFAULT_LISTS = [
  { id: "watchlist",  name: "Watchlist",    color: "#6366f1", icon: "🔖" },
  { id: "watching",   name: "Watching",     color: "#22d3ee", icon: "▶️" },
  { id: "watched",    name: "Watched",      color: "#4ade80", icon: "✅" },
  { id: "favorites",  name: "Favorites",    color: "#f59e0b", icon: "⭐" },
];

function readLists() {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(LISTS_KEY) || "{}"); }
  catch { return {}; }
}

function writeLists(data) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(LISTS_KEY, JSON.stringify(data)); } catch {}
}

/** Returns all lists, ensuring defaults exist. */
export function getAllLists() {
  const stored = readLists();
  // Seed defaults if not yet present
  let changed = false;
  for (const def of DEFAULT_LISTS) {
    if (!stored[def.id]) {
      stored[def.id] = { ...def, items: [] };
      changed = true;
    }
  }
  if (changed) writeLists(stored);
  return stored;
}

/** Returns items for a specific list. */
export function getListItems(listId) {
  return getAllLists()[listId]?.items ?? [];
}

/** Checks whether a movie/show is in a specific list. */
export function isInList(listId, id, mediaType = "movie") {
  return getListItems(listId).some((i) => i.id === id && i.mediaType === mediaType);
}

/** Checks all lists a movie/show is in. */
export function getItemLists(id, mediaType = "movie") {
  const all = getAllLists();
  return Object.keys(all).filter((lid) =>
    all[lid].items.some((i) => i.id === id && i.mediaType === mediaType)
  );
}

/**
 * Toggles a movie/show in a list.
 * Returns { added: boolean }
 */
export function toggleListItem(listId, item) {
  const all = getAllLists();
  if (!all[listId]) return { added: false };

  const existing = all[listId].items;
  const idx = existing.findIndex(
    (i) => i.id === item.id && i.mediaType === item.mediaType
  );

  if (idx >= 0) {
    all[listId].items = existing.filter((_, i) => i !== idx);
    writeLists(all);
    return { added: false };
  } else {
    all[listId].items = [{ ...item, addedAt: Date.now() }, ...existing];
    writeLists(all);
    return { added: true };
  }
}

/** Remove an item from all lists */
export function removeFromAllLists(id, mediaType = "movie") {
  const all = getAllLists();
  for (const lid of Object.keys(all)) {
    all[lid].items = all[lid].items.filter(
      (i) => !(i.id === id && i.mediaType === mediaType)
    );
  }
  writeLists(all);
}

// ─── Ratings ─────────────────────────────────────────────────────────────────

function readRatings() {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(RATINGS_KEY) || "{}"); }
  catch { return {}; }
}

function writeRatings(data) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(RATINGS_KEY, JSON.stringify(data)); } catch {}
}

function ratingKey(id, mediaType = "movie") {
  return `${mediaType}-${id}`;
}

/** Returns { rating, note, ratedAt } or null */
export function getRating(id, mediaType = "movie") {
  return readRatings()[ratingKey(id, mediaType)] ?? null;
}

/** Save or update a rating (1-5) + optional note */
export function setRating(id, mediaType = "movie", rating, note = "") {
  const all = readRatings();
  all[ratingKey(id, mediaType)] = { rating, note: note.trim(), ratedAt: Date.now() };
  writeRatings(all);
}

/** Remove a rating entirely */
export function removeRating(id, mediaType = "movie") {
  const all = readRatings();
  delete all[ratingKey(id, mediaType)];
  writeRatings(all);
}
