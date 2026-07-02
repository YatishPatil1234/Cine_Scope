import { getAllGenres, getDiscoverMovies } from "@/lib/tmdb";
import DiscoverClient from "./DiscoverClient";

export const metadata = {
  title: "Discover Movies — CineScope",
  description: "Filter movies by genre, decade, year, rating and sort order.",
};

export const revalidate = 43200;

export default async function DiscoverPage({ searchParams }) {
  const p = await searchParams;

  const sort      = p.sort      || "popularity.desc";
  const genre     = p.genre     || "";
  const year      = p.year      || "";
  const minRating = p.minRating || "";
  const dateFrom  = p.dateFrom  || "";
  const dateTo    = p.dateTo    || "";
  const page      = Math.max(1, parseInt(p.page || "1", 10));

  const [initial, genresData] = await Promise.all([
    getDiscoverMovies({
      sortBy:               sort,
      withGenres:           genre     || undefined,
      primaryReleaseYear:   year      ? Number(year) : undefined,
      voteAverageGte:       minRating ? Number(minRating) : undefined,
      primaryReleaseDateGte: dateFrom || undefined,
      primaryReleaseDateLte: dateTo   || undefined,
      page,
    }),
    getAllGenres(),
  ]);

  return (
    <DiscoverClient
      initialMovies={initial.results ?? []}
      initialTotalPages={Math.min(initial.total_pages ?? 1, 500)}
      genres={genresData?.genres ?? []}
      initialSort={sort}
      initialGenre={genre}
      initialYear={year}
      initialMinRating={minRating}
      initialDateFrom={dateFrom}
      initialDateTo={dateTo}
      initialPage={page}
    />
  );
}
