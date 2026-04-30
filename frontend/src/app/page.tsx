'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import MediaCard from '@/components/MediaCard';
import RecommendationCarousel from '@/components/RecommendationCarousel';
import { Flex, Heading, Text, Card, Button, Box } from '@radix-ui/themes';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface MediaItem {
  movie_id?: number;
  book_id?: number;
  work_id: number;
  title: string;
  release_year: number;
  average_rating: number;
  director_name?: string;
  author_name?: string;
  genres: string[];
}

interface Recommendation {
  work_id: number;
  title: string;
  work_type: string;
  average_rating: number;
  release_year?: number;
}

function LoadingState() {
  return (
    <Box className="flex justify-center p-8">
      <Text>Loading...</Text>
    </Box>
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
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
      <Card size="4" className="mb-8 bg-white/5 border border-white/10">
        <Flex direction="column" gap="4" align="center" py="8">
          <Heading size="9" className="text-[#53e076]">Welcome to Postcredits</Heading>
          <Text size="4" color="gray">Discover your next favorite book or movie</Text>
          <Flex gap="4" mt="4">
            <Link href="/register">
              <Button size="3" className="bg-[#53e076] text-black">Get Started</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="3">Login</Button>
            </Link>
          </Flex>
        </Flex>
      </Card>
      
      <Heading size="7" mb="4" className="text-white">Popular Movies</Heading>
      <Flex gap="4" wrap="wrap" mb="8">
        {movies.slice(0, 4).map((movie) => (
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
      
      <Heading size="7" mb="4" className="text-white">Popular Books</Heading>
      <Flex gap="4" wrap="wrap">
        {books.slice(0, 4).map((book) => (
          <MediaCard
            key={book.book_id}
            id={book.work_id}
            title={book.title}
            year={book.release_year}
            rating={book.average_rating}
            type="book"
            creator={book.author_name}
            genres={book.genres}
          />
        ))}
      </Flex>
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
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
      <Heading size="8" mb="6" className="text-white">For You</Heading>
      
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
      
      <Heading size="7" mb="4" className="text-white">Trending Movies</Heading>
      <Flex gap="4" wrap="wrap" mb="8">
        {trendingMovies.map((movie) => (
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
      
      <Heading size="7" mb="4" className="text-white">Trending Books</Heading>
      <Flex gap="4" wrap="wrap">
        {trendingBooks.map((book) => (
          <MediaCard
            key={book.book_id}
            id={book.work_id}
            title={book.title}
            year={book.release_year}
            rating={book.average_rating}
            type="book"
            creator={book.author_name}
            genres={book.genres}
          />
        ))}
      </Flex>
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