"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const TimerProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, max = 100, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-6 w-full overflow-hidden rounded-full bg-secondary",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary flex justify-end transition-all rounded-full"
      style={{
        transform: `translateX(-${100 - ((value || 0) / max) * 100 > 97.5 ? 97.5 : 100 - ((value || 0) / max) * 100}%)`,
      }}
    >
      <div className="flex items-center justify-end w-full h-full text-xs font-semibold text-white px-[10px]">
        {value}
      </div>
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
));

TimerProgress.displayName = ProgressPrimitive.Root.displayName;

export { TimerProgress };
