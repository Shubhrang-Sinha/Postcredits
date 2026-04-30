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
            ? "bg-accent-hover text-[#003914]"
            : "bg-bg-secondary/60 text-text-secondary border border-border-subtle/30 hover:bg-bg-tertiary"
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
              ? "bg-accent-hover text-[#003914]"
              : "bg-bg-secondary/60 text-text-secondary border border-border-subtle/30 hover:bg-bg-tertiary"
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}
