import React, { useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";
type RangeNumber = [number, number];

const MultipleSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    formatLabel?: (value: number) => string;
  }
>(
  (
    {
      className,
      min = 0,
      max = 100,
      step,
      formatLabel,
      value,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const initialValue: RangeNumber = Array.isArray(value)
      ? (value as RangeNumber)
      : [min, max];
    const [localValues, setLocalValues] = useState<RangeNumber>(initialValue);

    const handleValueChange = (newValues: RangeNumber) => {
      setLocalValues(newValues);
      if (onValueChange) {
        onValueChange(newValues);
      }
    };

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className,
        )}
        max={max}
        min={min}
        step={step}
        value={localValues as RangeNumber}
        onValueChange={handleValueChange}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        {localValues?.map((value: number, index: number) => (
          <React.Fragment key={index}>
            <div
              className="absolute text-center"
              style={{
                left: `calc(${((value - min) / (max - min)) * 100}% + 0px)`,
                top: `10px`,
              }}
            >
              <span className="text-xs">
                {formatLabel ? formatLabel(value) : value}
              </span>
            </div>
            <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
          </React.Fragment>
        ))}
      </SliderPrimitive.Root>
    );
  },
);

MultipleSlider.displayName = SliderPrimitive.Root.displayName;

export { MultipleSlider };
