import { getLanguageFromCookie } from "@/lib/language";
import { getMoviesByGenre } from "@/lib/tmdb";
import { cookies } from "next/headers";
import GenreClient from "./GenreClient";

export default async function GenrePage({ params, searchParams }) {
  const { id } = await params;
  const genreName = (await searchParams.name) || "Genre";

  const cookieStore = await cookies();
  const lang = getLanguageFromCookie(cookieStore);

  const initialData = await getMoviesByGenre(id, lang);

  return (
    <GenreClient
      genreId={id}
      genreName={genreName}
      initialData={initialData}
      lang={lang}
    />
  );
}
