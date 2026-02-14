export function getWatchlist() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("watchlist") || "[]");
}

export function isInWatchlist(id) {
  const list = getWatchlist();
  return list.some((movie) => movie.id === id);
}

export function toggleWatchlist(movie) {
  const list = getWatchlist();
  const exists = list.some((m) => m.id === movie.id);

  const updated = exists
    ? list.filter((m) => m.id !== movie.id)
    : [...list, movie];

  localStorage.setItem("watchlist", JSON.stringify(updated));
}
