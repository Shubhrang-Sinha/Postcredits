"use client";

import { useState } from "react";
import { Flex } from "@radix-ui/themes";

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
    small: "16px",
    medium: "28px",
    large: "40px",
  }[size];

  return (
    <Flex gap="1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(0)}
          style={{
            background: "none",
            border: "none",
            cursor: readonly ? "default" : "pointer",
            fontSize: starSize,
            padding: "4px",
            filter: star <= displayValue ? "none" : "grayscale(100%)",
            opacity: star <= displayValue ? 1 : 0.4,
          }}
        >
          ⭐
        </button>
      ))}
    </Flex>
  );
}
