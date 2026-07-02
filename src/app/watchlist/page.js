import { redirect } from "next/navigation";

// Watchlist is now part of My Lists
export default function WatchlistRedirect() {
  redirect("/lists");
}
