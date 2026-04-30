"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import StarRating from "@/components/StarRating";
import { Card, Flex, Text } from "@radix-ui/themes";

interface BookRatingClientProps {
  workId: number;
  initialRating?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function BookRatingClient({
  workId,
  initialRating,
}: BookRatingClientProps) {
  const { isAuthenticated } = useAuth();
  const [userRating, setUserRating] = useState(initialRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const getToken = () => localStorage.getItem("auth_token");

  const handleRating = async (rating: number) => {
    if (!isAuthenticated) {
      setMessage("Please login to rate");
      return;
    }

    setIsSubmitting(true);
    const token = getToken();

    if (userRating > 0) {
      try {
        const response = await fetch(`${API_BASE_URL}/ratings/${workId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ score: rating }),
        });
        if (response.ok) {
          setUserRating(rating);
          setMessage("Rating updated!");
        } else {
          setMessage("Failed to update rating");
        }
      } catch {
        setMessage("Failed to update rating");
      }
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/ratings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ workId, score: rating }),
        });
        if (response.ok) {
          setUserRating(rating);
          setMessage("Rating submitted!");
        } else {
          setMessage("Failed to submit rating");
        }
      } catch {
        setMessage("Failed to submit rating");
      }
    }

    setIsSubmitting(false);
    setTimeout(() => setMessage(""), 3000);
  };

  if (!isAuthenticated) {
    return (
      <Card className="bg-white/5 border border-white/10 p-4">
        <Text>Please login to rate this book</Text>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border border-white/10 p-4">
      <Flex direction="column" gap="3">
        <Text size="3" weight="bold">
          Your Rating:
        </Text>

        <StarRating
          value={userRating}
          onChange={handleRating}
          readonly={isSubmitting}
        />

        {message && (
          <Text
            size="2"
            className={
              message.includes("Failed") ? "text-red-500" : "text-[#53e076]"
            }
          >
            {message}
          </Text>
        )}
      </Flex>
    </Card>
  );
}
