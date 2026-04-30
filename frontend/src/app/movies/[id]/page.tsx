import { notFound } from "next/navigation";
import StarRating from "@/components/StarRating";
import { Card, Flex, Heading, Text, Separator, Box } from "@radix-ui/themes";
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
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "24px" }}>
      <Card size="4" className="bg-white/5 border border-white/10">
        <Flex direction="column" gap="4">
          <Heading size="9" className="text-white">
            {movie.title}
          </Heading>

          <Flex gap="4" wrap="wrap">
            <Text size="3" className="text-gray-400">
              Director: {movie.director_name}
            </Text>
            <Text size="3" className="text-gray-400">
              Year: {movie.release_year}
            </Text>
            <Text size="3" className="text-gray-400">
              Duration: {formatDuration(movie.duration)}
            </Text>
          </Flex>

          {movie.genres && movie.genres.length > 0 && (
            <Flex gap="2" wrap="wrap">
              {movie.genres.map((genre) => (
                <Text key={genre} size="2" color="gray">
                  {genre}
                </Text>
              ))}
            </Flex>
          )}

          <Separator className="bg-white/10" />

          <Flex justify="between" align="center">
            <Text size="4">Average Rating:</Text>
            <StarRating
              value={Math.round(movie.average_rating || 0)}
              readonly
              size="medium"
            />
          </Flex>

          <Box className="mt-4">
            <MovieRatingClient workId={movie.work_id} />
          </Box>
        </Flex>
      </Card>
    </main>
  );
}
