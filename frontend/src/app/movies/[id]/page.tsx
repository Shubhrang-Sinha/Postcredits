"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import StarRating from "@/components/StarRating";

interface Movie {
  movieId: number;
  workId: number;
  title: string;
  releaseYear: number;
  duration: number;
  director: string;
  averageRating: string;
  genres: string[];
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

export default function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    params.then((p) => setResolvedParams(p));
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchMovie = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("auth_token")
            : null;
        const headers: HeadersInit = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const response = await fetch(
          `/api/movies/${resolvedParams.id}`,
          { headers }
        );
        if (!response.ok) {
          setMovie(null);
        } else {
          const data = await response.json();
          setMovie(data);
        }
      } catch {
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [resolvedParams]);

  if (loading) {
    return (
      <main className="max-w-[800px] mx-auto px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-text-secondary">Loading...</p>
        </div>
      </main>
    );
  }

  if (!movie) {
    notFound();
  }

  return (
    <main className="max-w-[800px] mx-auto px-6">
      <div className="bg-bg-secondary/10 border border-border-subtle/20 rounded-lg p-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-text-primary">
            {movie.title}
          </h1>

          <div className="flex gap-4 flex-wrap">
            <span className="text-text-secondary">
              Director: {movie.director}
            </span>
            <span className="text-text-secondary">
              Year: {movie.releaseYear}
            </span>
            <span className="text-text-secondary">
              Duration: {formatDuration(movie.duration)}
            </span>
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {movie.genres.map((genre) => (
                <span key={genre} className="text-text-secondary text-sm">
                  {genre}
                </span>
              ))}
            </div>
          )}

          <div className="border-t border-border-subtle/20" />

          <div className="flex justify-between items-center">
            <span className="text-lg">Average Rating:</span>
            <StarRating
              value={Math.round(parseFloat(movie.averageRating) || 0)}
              readonly
              size="medium"
            />
          </div>
        </div>
      </div>
    </main>
  );
}