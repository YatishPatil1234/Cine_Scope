// Thin compatibility shim — delegates to the new lists system
import { getListItems, isInList, toggleListItem } from "./lists";

export function getWatchlist() {
  return getListItems("watchlist");
}

export function isInWatchlist(id) {
  return isInList("watchlist", id, "movie");
}

export function toggleWatchlist(movie) {
  toggleListItem("watchlist", { ...movie, mediaType: "movie" });
}
