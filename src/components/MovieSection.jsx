import MovieCard from "./MovieCard";

export default function MovieSection({ title, movies }) {
  const list = movies ?? [];
  const isEmpty = list.length === 0;

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12 w-full overflow-x-hidden">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">
        {title}
      </h2>

      {isEmpty ? (
        <p className="text-muted-foreground text-sm py-6">
          No movies in this section right now.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {list.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}
