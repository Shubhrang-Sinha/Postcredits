'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import MediaCard from '@/components/MediaCard';
import RecommendationCarousel from '@/components/RecommendationCarousel';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface MediaItem {
  movieId?: number;
  bookId?: number;
  workId: number;
  title: string;
  releaseYear: number;
  averageRating: number;
  director?: string;
  author?: string;
  genres: string[];
}

interface Recommendation {
  workId: number;
  title: string;
  type: string;
  averageRating: number;
  releaseYear?: number;
}

function LoadingState() {
  return (
    <div className="flex justify-center items-center p-12">
      <div className="text-[#bccbb9]">Loading...</div>
    </div>
  );
}

function PublicHome() {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [books, setBooks] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [moviesRes, booksRes] = await Promise.all([
          fetch(`${API_BASE_URL}/movies?limit=6`),
          fetch(`${API_BASE_URL}/books?limit=6`),
        ]);
        
        if (moviesRes.ok) setMovies(await moviesRes.json());
        if (booksRes.ok) setBooks(await booksRes.json());
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingState />;

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1db954]/20 via-[#261d1d] to-[#191111] border border-[#3d4a3d]/30 p-8 md:p-12 mb-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNC0xNHoiIGZpbGw9IiMzZDRhM2QiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-3">
            Postcredits
          </h1>
          <p className="text-[#bccbb9] text-lg mb-6">Discover your next favorite book or movie</p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/register" 
              className="px-6 py-3 bg-[#1db954] text-[#003914] rounded-full font-bold hover:bg-[#53e076] transition-colors"
            >
              Get Started
            </Link>
            <Link 
              href="/login" 
              className="px-6 py-3 bg-[#312828] text-white rounded-full font-bold border border-[#3d4a3d]/50 hover:bg-[#3c3232] transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
      
      {/* Movies Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Popular Movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {movies.slice(0, 4).map((movie) => (
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
      </div>
      
      {/* Books Section */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Popular Books</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {books.slice(0, 4).map((book) => (
            <MediaCard
              key={book.bookId}
              id={book.workId}
              title={book.title}
              year={book.releaseYear}
              rating={book.averageRating}
              type="book"
              creator={book.author}
              genres={book.genres}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function PersonalizedHome() {
  const [movieRecs, setMovieRecs] = useState<Recommendation[]>([]);
  const [bookRecs, setBookRecs] = useState<Recommendation[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function fetchData() {
      if (!isAuthenticated) return;
      
      const token = localStorage.getItem('auth_token');
      const requestOptions: RequestInit = token 
        ? { headers: { 'Authorization': `Bearer ${token}` } }
        : {};

      try {
        const [movieRecsRes, bookRecsRes, trendingMoviesRes, trendingBooksRes] = await Promise.all([
          fetch(`${API_BASE_URL}/recommendations/blend?type=movie&limit=8`, requestOptions),
          fetch(`${API_BASE_URL}/recommendations/blend?type=book&limit=8`, requestOptions),
          fetch(`${API_BASE_URL}/movies?limit=4`, requestOptions),
          fetch(`${API_BASE_URL}/books?limit=4`, requestOptions),
        ]);
        
        if (movieRecsRes.ok) setMovieRecs(await movieRecsRes.json());
        if (bookRecsRes.ok) setBookRecs(await bookRecsRes.json());
        if (trendingMoviesRes.ok) setTrendingMovies(await trendingMoviesRes.json());
        if (trendingBooksRes.ok) setTrendingBooks(await trendingBooksRes.json());
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isAuthenticated]);

  if (loading) return <LoadingState />;

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <h1 className="text-3xl font-bold text-white mb-6">For You</h1>
      
      {movieRecs.length > 0 && (
        <RecommendationCarousel 
          title="Recommended Movies" 
          recommendations={movieRecs} 
        />
      )}
      
      {bookRecs.length > 0 && (
        <RecommendationCarousel 
          title="Recommended Books" 
          recommendations={bookRecs} 
        />
      )}
      
      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Trending Movies</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {trendingMovies.map((movie) => (
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
      
      <h2 className="text-2xl font-bold text-white mb-4">Trending Books</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trendingBooks.map((book) => (
          <MediaCard
            key={book.bookId}
            id={book.workId}
            title={book.title}
            year={book.releaseYear}
            rating={book.averageRating}
            type="book"
            creator={book.author}
            genres={book.genres}
          />
        ))}
      </div>
    </main>
  );
}

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState />;
  }

  return isAuthenticated ? <PersonalizedHome /> : <PublicHome />;
}