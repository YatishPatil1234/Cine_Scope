import SectionLink from "@/components/SectionLink";
import MovieCard from "./MovieCard";

export default function HorizontalMovieSection({ title, movies, seeAllHref }) {
  const list = movies ?? [];
  if (list.length === 0) return null;

  return (
    <section className="page-container py-8 sm:py-10">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="section-title">{title}</h2>
        {seeAllHref && (
          <SectionLink href={seeAllHref} size="sm">See all</SectionLink>
        )}
      </div>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 hide-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
        {list.slice(0, 14).map((movie) => (
          <div
            key={movie.id}
            className="w-[130px] sm:w-[148px] shrink-0 snap-start"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
