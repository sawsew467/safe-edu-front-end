"use client";

import type React from "react";

import { useRef, useState, useEffect, type ChangeEvent } from "react";

import { cn } from "@/lib/utils";

interface AutoExpandingTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
  minRows?: number;
}

export function AutoExpandingTextarea({
  maxRows = 5,
  minRows = 1,
  className,
  onChange,
  ...props
}: AutoExpandingTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(props.defaultValue || props.value || "");

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    onChange?.(event);

    adjustHeight();
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";

      const lineHeight =
        Number.parseInt(getComputedStyle(textareaRef.current).lineHeight) || 20;

      const minHeight = minRows * lineHeight;
      const maxHeight = maxRows * lineHeight;

      const scrollHeight = textareaRef.current.scrollHeight;

      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
    const timer = setTimeout(adjustHeight, 0);

    return () => clearTimeout(timer);
  }, [value, maxRows, minRows]);

  return (
    <textarea
      ref={textareaRef}
      className={cn(
        "resize-none overflow-y-auto w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      rows={minRows}
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
}
