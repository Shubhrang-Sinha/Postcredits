"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import MediaCard from "@/components/MediaCard";
import { Flex, Heading, Text, Spinner, Box } from "@radix-ui/themes";
import { useState } from "react";

interface RatingItem {
  rating_id: number;
  work_id: number;
  title: string;
  score: number;
  work_type: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
      <Box className="flex justify-center p-8">
        <Spinner size="3" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main style={{ maxWidth: 1400, margin: "0 auto", padding: "24px" }}>
      <Heading size="8" mb="2" className="text-white">
        Watchlist
      </Heading>
      <Text size="3" mb="6" color="gray" className="block">
        {ratings.length} rated items
      </Text>

      {ratings.length === 0 ? (
        <Box className="p-8 text-center text-gray-400">
          <Text>
            You haven't rated any items yet. Start browsing to add to your
            watchlist!
          </Text>
        </Box>
      ) : (
        <Flex gap="4" wrap="wrap">
          {ratings.map((rating) => (
            <MediaCard
              key={rating.rating_id}
              id={rating.work_id}
              title={rating.title}
              rating={rating.score}
              type={rating.work_type === "movie" ? "movie" : "book"}
            />
          ))}
        </Flex>
      )}
    </main>
  );
}

export default WatchlistContent;
