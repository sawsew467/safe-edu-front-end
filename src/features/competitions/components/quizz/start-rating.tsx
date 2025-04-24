"use client";

import type React from "react";

import { useState, useEffect, useId } from "react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
  color?: string;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 10,
  className,
  size = "md",
  color = "#75A815",
  interactive = false,
  onChange,
}: StarRatingProps) {
  // Generate a unique ID for this component instance
  const uniqueId = useId();

  // Convert rating from maxRating scale to 5-star scale
  const starsValue = (rating / maxRating) * 5;
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [localRating, setLocalRating] = useState(rating);

  useEffect(() => {
    setLocalRating(rating);
  }, [rating]);

  // Size mapping for the stars
  const sizeMap = {
    sm: { width: 100, height: 20, fontSize: "text-sm" },
    md: { width: 150, height: 30, fontSize: "text-base" },
    lg: { width: 200, height: 40, fontSize: "text-lg" },
  };

  const { width, height, fontSize } = sizeMap[size];

  // Handle star click for interactive mode
  const handleStarClick = (starIndex: number) => {
    if (!interactive) return;

    // Convert from 5-star scale back to maxRating scale
    // Adding 1 because starIndex is 0-based
    const newRating = ((starIndex + 1) / 5) * maxRating;

    setLocalRating(newRating);
    onChange?.(newRating);
  };

  // Handle mouse hover for interactive mode
  const handleMouseMove = (
    e: React.MouseEvent<SVGSVGElement>,
    starIndex: number,
  ) => {
    if (!interactive) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const starWidth = rect.width / 5;
    const x = e.clientX - rect.left;

    // Calculate which star and what portion of it is being hovered
    const hoveredStarIndex = Math.floor(x / starWidth);
    const starFraction = (x % starWidth) / starWidth;

    // Calculate the hover value on the 5-star scale
    const hoverStarValue = hoveredStarIndex + starFraction;

    // Convert to maxRating scale
    const hoverRating = (hoverStarValue / 5) * maxRating;

    setHoverValue(hoverRating);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  // Format the rating to show one decimal place if showScore is true
  const formattedRating = localRating.toFixed(1);

  // Use hover value if available, otherwise use the actual rating
  const displayValue = hoverValue !== null ? hoverValue : starsValue;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        className={cn("cursor-default", interactive && "cursor-pointer")}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        onClick={
          interactive
            ? () => handleStarClick(Math.floor(displayValue))
            : undefined
        }
        onMouseLeave={interactive ? handleMouseLeave : undefined}
        onMouseMove={interactive ? (e) => handleMouseMove(e, 0) : undefined}
      >
        <defs>
          {/* Define star shape as a symbol for reuse with unique ID */}
          <symbol id={`star-${uniqueId}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </symbol>

          {/* Define linear gradient for partial fill with unique IDs */}
          {[0, 1, 2, 3, 4].map((i) => {
            const fillPercentage = Math.max(0, Math.min(1, displayValue - i));

            return (
              <linearGradient
                key={`gradient-${i}-${uniqueId}`}
                id={`star-fill-${i}-${uniqueId}`}
                x1="0"
                x2="1"
                y1="0"
                y2="0"
              >
                <stop offset={`${fillPercentage * 100}%`} stopColor={color} />
                <stop offset={`${fillPercentage * 100}%`} stopColor="#E2E8F0" />
              </linearGradient>
            );
          })}
        </defs>

        {/* Render 5 stars with unique gradient references */}
        {[0, 1, 2, 3, 4].map((i) => {
          const starWidth = width / 5;
          const x = i * starWidth;

          return (
            <use
              key={i}
              fill={`url(#star-fill-${i}-${uniqueId})`}
              height={height}
              href={`#star-${uniqueId}`}
              stroke="#E2E8F0"
              strokeWidth="0.5"
              width={starWidth}
              x={x}
              y="0"
            />
          );
        })}
      </svg>
    </div>
  );
}
