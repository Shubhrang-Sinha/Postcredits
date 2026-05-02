"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import StarRating from "@/components/StarRating";

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
      <div className="bg-bg-secondary/10 border border-border-subtle/20 p-4 rounded-lg">
        <p className="text-text-secondary">Please login to rate this book</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-secondary/10 border border-border-subtle/20 p-4 rounded-lg">
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-bold text-text-primary">Your Rating:</h3>

        <StarRating
          value={userRating}
          onChange={handleRating}
          readonly={isSubmitting}
        />

        {message && (
          <p
            className={`text-sm ${message.includes("Failed") ? "text-danger" : "text-accent"}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
