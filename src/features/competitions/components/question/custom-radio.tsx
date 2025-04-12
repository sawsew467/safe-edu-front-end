"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

interface CustomRadioProps extends React.HTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function CustomRadio({
  checked = false,
  onCheckedChange,
  className,
  ...props
}: CustomRadioProps) {
  return (
    <div>
      <button
        className={cn(
          "inline-flex items-center justify-center cursor-pointer",
          className,
        )}
        type="button"
        onClick={() => onCheckedChange?.(!checked)}
        {...props}
      >
        {checked ? (
          <svg
            fill="none"
            height="32"
            viewBox="0 0 32 32"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" fill="#4CAF50" r="16" />
            <path
              d="M22.6667 11L13.5 20.1667L9.33333 16"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        ) : (
          <svg
            fill="none"
            height="32"
            viewBox="0 0 32 32"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="15" stroke="#DAA520" strokeWidth="2" />
          </svg>
        )}
      </button>
    </div>
  );
}
