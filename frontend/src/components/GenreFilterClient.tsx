'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import GenreFilter from './GenreFilter';

interface Genre {
  genre_id: number;
  name: string;
}

interface GenreFilterClientProps {
  genres: Genre[];
  excludeType?: 'movie' | 'book';
}

export default function GenreFilterClient({ genres, excludeType }: GenreFilterClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentGenre = searchParams.get('genre');
  const selectedGenre = currentGenre ? parseInt(currentGenre) : null;

  const filteredGenres = excludeType 
    ? genres.filter(g => g.name.toLowerCase() !== excludeType)
    : genres;

  const handleGenreSelect = (genreId: number | null) => {
    const path = window.location.pathname;
    if (genreId) {
      router.push(`${path}?genre=${genreId}`);
    } else {
      router.push(path);
    }
  };

  return (
    <GenreFilter
      genres={filteredGenres}
      selectedGenre={selectedGenre}
      onGenreSelect={handleGenreSelect}
    />
  );
}