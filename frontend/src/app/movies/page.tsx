import api from '@/lib/api';
import MediaCard from '@/components/MediaCard';
import { Flex, Heading, Text, Box } from '@radix-ui/themes';
import GenreFilterServer from './GenreFilterServer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Movie {
  movie_id: number;
  work_id: number;
  title: string;
  release_year: number;
  duration: number;
  director_name: string;
  average_rating: number;
  genres: string[];
}

interface Genre {
  genre_id: number;
  name: string;
}

async function getMovies(genreId?: number): Promise<Movie[]> {
  const url = genreId 
    ? `${API_BASE_URL}/movies?genre=${genreId}` 
    : `${API_BASE_URL}/movies`;
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

async function getGenres(): Promise<Genre[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/genres`);
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: { genre?: string };
}) {
  const genreId = searchParams.genre ? parseInt(searchParams.genre) : undefined;
  const [movies, genres] = await Promise.all([
    getMovies(genreId),
    getGenres(),
  ]);

  const movieGenres = genres.filter((g: Genre) => g.name.toLowerCase() !== 'book');

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
      <Heading size="8" mb="4" className="text-white">Movies</Heading>
      
      <GenreFilterServer genres={movieGenres} />
      
      {movies.length === 0 ? (
        <Box className="p-8 text-center text-gray-400">
          <Text>No movies found</Text>
        </Box>
      ) : (
        <Flex gap="4" wrap="wrap">
          {movies.map((movie) => (
            <MediaCard
              key={movie.movie_id}
              id={movie.work_id}
              title={movie.title}
              year={movie.release_year}
              rating={movie.average_rating}
              type="movie"
              creator={movie.director_name}
              genres={movie.genres}
            />
          ))}
        </Flex>
      )}
    </main>
  );
}