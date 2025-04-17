"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
interface PropsType
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonVariants> {
  options: Array<{
    label: string;
    value: string;
  }>;
  placeholder: string;
  onValueChange: (value: string) => void;
  value: string;
}

export function Combobox({
  options,
  placeholder,
  variant,
  onValueChange,
  className,
  value,
  ...props
}: PropsType) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover {...props} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            "flex w-full p-1 px-3 text-black dark:text-white rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto",
            className,
          )}
          role="combobox"
          value={value}
          variant={variant}
        >
          {value
            ? options?.find((option) => option?.value === value)?.label
            : (placeholder ?? "Select option...")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search option..." />
          <CommandList className="no-scrollbar">
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    const newValue = option.value === value ? "" : option.value;

                    onValueChange(newValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
