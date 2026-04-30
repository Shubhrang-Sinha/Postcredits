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
        <span className="px-4 py-2 rounded-full text-sm font-medium bg-[#1db954] text-[#003914]">
          All
        </span>
      </Link>
      {genres.map((genre) => (
        <Link
          key={genre.genreId}
          href={`/books?genre=${genre.genreId}`}
          className="no-underline"
        >
          <span className="px-4 py-2 rounded-full text-sm font-medium bg-[#261d1d]/60 text-[#bccbb9] border border-[#3d4a3d]/30 hover:bg-[#312828] transition-colors">
            {genre.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
