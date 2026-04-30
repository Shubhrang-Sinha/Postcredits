"use client";

interface Genre {
  genreId: number;
  name: string;
}

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: number | null;
  onGenreSelect: (genreId: number | null) => void;
}

export default function GenreFilter({
  genres,
  selectedGenre,
  onGenreSelect,
}: GenreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onGenreSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedGenre === null
            ? "bg-[#1db954] text-[#003914]"
            : "bg-[#261d1d]/60 text-[#bccbb9] border border-[#3d4a3d]/30 hover:bg-[#312828]"
        }`}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre.genreId}
          onClick={() => onGenreSelect(genre.genreId)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedGenre === genre.genreId
              ? "bg-[#1db954] text-[#003914]"
              : "bg-[#261d1d]/60 text-[#bccbb9] border border-[#3d4a3d]/30 hover:bg-[#312828]"
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}
