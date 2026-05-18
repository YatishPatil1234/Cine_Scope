import DiscoverClient from "./DiscoverClient";
import { getAllGenres, getDiscoverMovies } from "@/lib/tmdb";

export const metadata = {
  title: "Discover Movies",
};

export const revalidate = 43200;

export default async function DiscoverPage() {
  const [initial, genresData] = await Promise.all([
    getDiscoverMovies({ sortBy: "popularity.desc" }),
    getAllGenres(),
  ]);

  return (
    <DiscoverClient
      initialMovies={initial.results ?? []}
      initialTotalPages={initial.total_pages ?? 1}
      genres={genresData?.genres ?? []}
    />
  );
}
