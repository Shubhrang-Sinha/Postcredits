"use client";

import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "small" | "medium" | "large";
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = "medium",
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  const starSize = {
    small: "text-base",
    medium: "text-2xl",
    large: "text-4xl",
  }[size];

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(0)}
          className={`${starSize} p-1 bg-transparent border-none ${readonly ? "cursor-default" : "cursor-pointer"} ${star <= displayValue ? "" : "grayscale opacity-40"} hover:scale-110 transition-transform`}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}
