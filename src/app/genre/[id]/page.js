import { getMoviesByGenre } from "@/lib/tmdb";
import GenreClient from "./GenreClient";

export const revalidate = 43200;

export async function generateMetadata({ params, searchParams }) {
  const genreName = (await searchParams?.name) || "Genre";

  return {
    title: `${genreName}`,
    description: `Explore the best ${genreName.toLowerCase()} movies on CineScope.`,
    openGraph: {
      title: genreName,
      description: `Discover ${genreName} movies.`,
    },
  };
}

export default async function GenrePage({ params, searchParams }) {
  const { id } = await params;
  const genreName = (await searchParams.name) || "Genre";

  const initialData = await getMoviesByGenre(id);

  return (
    <GenreClient
      genreId={id}
      genreName={genreName}
      initialData={initialData}
    />
  );
}
