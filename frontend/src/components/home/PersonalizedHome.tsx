"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import LoadingState from "@/components/common/LoadingState";
import RecommendationCarousel from "@/components/media/RecommendationCarousel";
import MediaCard from "@/components/media/MediaCard";
import {
  getMovieRecommendations,
  getBookRecommendations,
  getTrendingMovies,
  getTrendingBooks,
} from "@/lib/api";
import type { MediaItem, Recommendation } from "@/lib/types";

export default function PersonalizedHome() {
  const [movieRecs, setMovieRecs] = useState<Recommendation[]>([]);
  const [bookRecs, setBookRecs] = useState<Recommendation[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function fetchData() {
      if (!isAuthenticated) return;

      try {
        const [
          movieRecsData,
          bookRecsData,
          trendingMoviesData,
          trendingBooksData,
        ] = await Promise.all([
          getMovieRecommendations(8),
          getBookRecommendations(8),
          getTrendingMovies(4),
          getTrendingBooks(4),
        ]);

        setMovieRecs(movieRecsData);
        setBookRecs(bookRecsData);
        setTrendingMovies(trendingMoviesData);
        setTrendingBooks(trendingBooksData);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
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
          type="movie"
        />
      )}

      {bookRecs.length > 0 && (
        <RecommendationCarousel
          title="Recommended Books"
          recommendations={bookRecs}
          type="book"
        />
      )}

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">
        Trending Movies
      </h2>
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
