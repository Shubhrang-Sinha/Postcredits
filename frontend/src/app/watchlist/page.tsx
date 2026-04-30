"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import MediaCard from "@/components/MediaCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface RatingItem {
  rating_id: number;
  work_id: number;
  title: string;
  score: number;
  work_type: string;
}

function WatchlistContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    async function fetchRatings() {
      if (!isAuthenticated) return;

      const token = localStorage.getItem("auth_token");
      try {
        const response = await fetch(`${API_BASE_URL}/ratings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setRatings(data);
        }
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchRatings();
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

  return (
    <main className="max-w-[1400px] mx-auto px-6">
      <h1 className="text-3xl font-bold text-text-primary mb-1">
        Watchlist
      </h1>
      <p className="text-text-secondary mb-6">{ratings.length} rated items</p>

      {ratings.length === 0 ? (
        <div className="p-8 text-center text-text-secondary">
          <p>You haven't rated any items yet. Start browsing to add to your watchlist!</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {ratings.map((rating) => (
            <MediaCard
              key={rating.rating_id}
              id={rating.work_id}
              title={rating.title}
              rating={rating.score}
              type={rating.work_type === "movie" ? "movie" : "book"}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default WatchlistContent;
