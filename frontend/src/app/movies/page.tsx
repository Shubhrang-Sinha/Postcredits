import MediaCard from '@/components/MediaCard';
import GenreFilterServer from './GenreFilterServer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Movie {
  movieId: number;
  workId: number;
  title: string;
  releaseYear: number;
  duration: number;
  director: string;
  averageRating: number;
  genres: string[];
}

interface Genre {
  genreId: number;
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
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <h1 className="text-3xl font-bold text-white mb-6">Movies</h1>
      
      <GenreFilterServer genres={movieGenres} />
      
      {movies.length === 0 ? (
        <div className="p-8 text-center text-[#bccbb9]">
          No movies found
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <MediaCard
              key={movie.movieId}
              id={movie.workId}
              title={movie.title}
              year={movie.releaseYear}
              rating={movie.averageRating}
              type="movie"
              creator={movie.director}
              genres={movie.genres}
            />
          ))}
        </div>
      )}
    </main>
  );
}