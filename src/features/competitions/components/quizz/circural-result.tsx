"use client";

import { useEffect, useState } from "react";

interface CircularProgressProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({
  percent,
  size = 150,
  strokeWidth = 15,
}: CircularProgressProps) {
  const [progress, setProgress] = useState(0);

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percent * 10);
    }, 100);

    return () => clearTimeout(timer);
  }, [percent]);

  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  const getColor = (value: number) => {
    if (value >= 8) return "#10b981"; // green
    if (value >= 5) return "#f59e0b"; // yellow

    return "#ef4444"; // red
  };

  const color = getColor(percent);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90" height={size} width={size}>
        {/* Background Circle */}
        <circle
          cx={center}
          cy={center}
          fill="none"
          opacity={0.2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>
          {percent?.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
