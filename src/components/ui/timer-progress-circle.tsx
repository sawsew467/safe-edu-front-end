"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  value: number;
  maxValue: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showSeconds?: boolean;
}

export default function TimerProgressCircle({
  value,
  maxValue,
  size = 100,
  strokeWidth = 10,
  className,
  showSeconds = true,
}: CountdownTimerProps) {
  const [offset, setOffset] = useState(0);
  const [color, setColor] = useState("#10b981"); // Start with green

  // Calculate circle properties
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // Update the circle offset and color based on value/maxValue
  useEffect(() => {
    // Calculate how much of the circle should be filled
    const progressPercentage = value / maxValue;
    const calculatedOffset = circumference * (1 - progressPercentage);

    setOffset(calculatedOffset);

    // Interpolate color from green to yellow to red
    if (progressPercentage > 0.6) {
      setColor("#10b981"); // Green
    } else if (progressPercentage > 0.3) {
      setColor("#eab308"); // Yellow
    } else {
      setColor("#ef4444"); // Red
    }
  }, [value, maxValue, circumference]);

  // Format the time value
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    if (showSeconds) {
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      return minutes.toString();
    }
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
    >
      <svg
        className="transform -rotate-90"
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          fill="transparent"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />

        {/* Animated progress circle */}
        <circle
          className="transition-all duration-1000 ease-linear"
          cx={center}
          cy={center}
          fill="transparent"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </svg>

      {/* Time display in the center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("text-lg font-medium")} style={{ color }}>
          {formatTime(value)}
        </span>
      </div>
    </div>
  );
}
