import { notFound } from "next/navigation";
import StarRating from "@/components/StarRating";
import MovieRatingClient from "./MovieRatingClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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

async function getMovie(id: string): Promise<Movie | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

async function getUserRating(
  workId: number,
): Promise<{ rating_id: number; score: number } | null> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/ratings?workId=${workId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data[0] || null;
  } catch {
    return null;
  }
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

export default async function MovieDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const movie = await getMovie(params.id);

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
              Director: {movie.director_name}
            </span>
            <span className="text-text-secondary">
              Year: {movie.release_year}
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
              value={Math.round(movie.average_rating || 0)}
              readonly
              size="medium"
            />
          </div>

          <div className="mt-4">
            <MovieRatingClient workId={movie.work_id} />
          </div>
        </div>
      </div>
    </main>
  );
}
