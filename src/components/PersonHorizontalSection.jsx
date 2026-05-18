import PersonCard from "./PersonCard";

export default function PersonHorizontalSection({ title, people }) {
  const list = people ?? [];
  if (list.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 w-full overflow-x-hidden">
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-4">
        {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar scroll-smooth snap-x snap-mandatory -mx-3 px-3 sm:mx-0 sm:px-0">
        {list.slice(0, 15).map((person) => (
          <div key={person.id} className="snap-start">
            <PersonCard person={person} />
          </div>
        ))}
      </div>
    </section>
  );
}
