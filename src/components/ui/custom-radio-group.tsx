"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square relative h-8 w-8 group rounded-full border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex pointer-events-none items-center justify-center absolute inset-0 z-10">
        <svg
          className="dark:text-green-500 text-black"
          fill="none"
          height="32"
          viewBox="0 0 32 32"
          width="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="16"
            cy="16"
            fill="#6aaf6c"
            r="15"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M22.6667 11L13.5 20.1667L9.33333 16"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </svg>
      </RadioGroupPrimitive.Indicator>
      <div className="absolute inset-0 z-0 group-data-[state=unchecked]:hover:scale-110 transition-transform duration-150">
        <svg
          className="dark:text-green-500 text-black"
          fill="none"
          height="32"
          viewBox="0 0 32 32"
          width="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="16"
            cy="16"
            r="15"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            className="group-hover:opacity-100 opacity-0 transition-opacity duration-300"
            d="M22.6667 11L13.5 20.1667L9.33333 16"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
    </RadioGroupPrimitive.Item>
  );
});

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
