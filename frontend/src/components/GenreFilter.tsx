'use client';

import { Button } from '@radix-ui/themes';

interface Genre {
  genre_id: number;
  name: string;
}

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: number | null;
  onGenreSelect: (genreId: number | null) => void;
}

export default function GenreFilter({ genres, selectedGenre, onGenreSelect }: GenreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedGenre === null ? 'solid' : 'outline'}
        size="1"
        onClick={() => onGenreSelect(null)}
      >
        All
      </Button>
      {genres.map((genre) => (
        <Button
          key={genre.genre_id}
          variant={selectedGenre === genre.genre_id ? 'solid' : 'outline'}
          size="1"
          onClick={() => onGenreSelect(genre.genre_id)}
        >
          {genre.name}
        </Button>
      ))}
    </div>
  );
}