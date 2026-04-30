"use client";

import { useState } from "react";
import MediaCard from "./MediaCard";

interface Recommendation {
  workId: number;
  title: string;
  type: string;
  averageRating: number;
  releaseYear?: number;
  similarity?: number;
}

interface RecommendationCarouselProps {
  title: string;
  recommendations: Recommendation[];
}

export default function RecommendationCarousel({
  title,
  recommendations,
}: RecommendationCarouselProps) {
  const [index, setIndex] = useState(0);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const currentItems = recommendations.slice(
    index * itemsPerPage,
    (index + 1) * itemsPerPage,
  );

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIndex(Math.max(0, index - 1))}
            disabled={index === 0}
            className="w-8 h-8 rounded-full border border-[#3d4a3d]/50 bg-[#261d1d] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#312828] transition-colors"
          >
            ‹
          </button>
          <span className="text-[#bccbb9] text-sm min-w-[60px] text-center">
            {index + 1} / {totalPages}
          </span>
          <button
            onClick={() => setIndex(Math.min(totalPages - 1, index + 1))}
            disabled={index >= totalPages - 1}
            className="w-8 h-8 rounded-full border border-[#3d4a3d]/50 bg-[#261d1d] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#312828] transition-colors"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {currentItems.map((rec) => (
          <MediaCard
            key={rec.workId}
            id={rec.workId}
            title={rec.title}
            year={rec.releaseYear}
            rating={rec.averageRating}
            type={rec.type as "movie" | "book"}
          />
        ))}
      </div>
    </div>
  );
}
