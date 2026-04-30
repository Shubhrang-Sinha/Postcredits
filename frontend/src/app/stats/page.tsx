"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import StatsChart from "@/components/StatsChart";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface GenreStat {
  genre: string;
  count: number;
}

interface YearStat {
  year: number;
  count: number;
  avg_rating: number;
}

function StatsContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [movieGenres, setMovieGenres] = useState<GenreStat[]>([]);
  const [bookGenres, setBookGenres] = useState<GenreStat[]>([]);
  const [movieYears, setMovieYears] = useState<YearStat[]>([]);
  const [bookYears, setBookYears] = useState<YearStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"movies" | "books">("movies");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    async function fetchStats() {
      if (!isAuthenticated) return;

      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const requestOptions: RequestInit = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        const [movieGenresRes, bookGenresRes, movieYearsRes, bookYearsRes] =
          await Promise.all([
            fetch(`${API_BASE_URL}/stats/genres?type=movie`, requestOptions),
            fetch(`${API_BASE_URL}/stats/genres?type=book`, requestOptions),
            fetch(`${API_BASE_URL}/stats/years?type=movie`, requestOptions),
            fetch(`${API_BASE_URL}/stats/years?type=book`, requestOptions),
          ]);

        if (movieGenresRes.ok) setMovieGenres(await movieGenresRes.json());
        if (bookGenresRes.ok) setBookGenres(await bookGenresRes.json());
        if (movieYearsRes.ok) setMovieYears(await movieYearsRes.json());
        if (bookYearsRes.ok) setBookYears(await bookYearsRes.json());
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  if (isLoading || loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const movieGenreData = movieGenres.map((g) => ({
    label: g.genre,
    value: g.count,
  }));
  const bookGenreData = bookGenres.map((g) => ({
    label: g.genre,
    value: g.count,
  }));
  const movieYearData = movieYears
    .filter((y) => y.count > 0)
    .map((y) => ({ label: y.year.toString(), value: y.count }));
  const bookYearData = bookYears
    .filter((y) => y.count > 0)
    .map((y) => ({ label: y.year.toString(), value: y.count }));

  return (
    <main className="max-w-[1400px] mx-auto px-6">
      <h1 className="text-3xl font-bold text-text-primary mb-1">
        Spotistats
      </h1>
      <p className="text-text-secondary mb-6">Your viewing and reading statistics</p>

      <div className="mt-4">
        <div className="flex gap-1 border-b border-border-subtle/30">
          <button
            onClick={() => setActiveTab("movies")}
            className={`px-4 py-2 -mb-px text-sm font-medium transition-colors ${
              activeTab === "movies"
                ? "text-accent border-b-2 border-accent"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setActiveTab("books")}
            className={`px-4 py-2 -mb-px text-sm font-medium transition-colors ${
              activeTab === "books"
                ? "text-accent border-b-2 border-accent"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Books
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {activeTab === "movies" && (
            <>
              <StatsChart
                title="Movies by Genre"
                data={movieGenreData}
                color="#06b6d4"
              />
              <StatsChart
                title="Movies by Year"
                data={movieYearData}
                color="#8b5cf6"
              />
            </>
          )}

          {activeTab === "books" && (
            <>
              <StatsChart
                title="Books by Genre"
                data={bookGenreData}
                color="#10b981"
              />
              <StatsChart
                title="Books by Year"
                data={bookYearData}
                color="#f59e0b"
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default StatsContent;
