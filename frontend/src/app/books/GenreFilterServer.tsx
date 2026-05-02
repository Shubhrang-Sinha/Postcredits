import Link from "next/link";

interface Genre {
  genreId: number;
  name: string;
}

interface GenreFilterServerProps {
  genres: Genre[];
}

export default function GenreFilterServer({ genres }: GenreFilterServerProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link href="/books" className="no-underline">
        <span className="px-4 py-2 rounded-full text-sm font-medium bg-accent-hover text-[#003914] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none">
          All
        </span>
      </Link>
      {genres.map((genre) => (
        <Link
          key={genre.genreId}
          href={`/books?genre=${genre.genreId}`}
          className="no-underline"
        >
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-bg-secondary/60 text-text-secondary border border-border-subtle/30 hover:bg-bg-tertiary transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none">
            {genre.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
