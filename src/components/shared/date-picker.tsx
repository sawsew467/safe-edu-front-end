"use client";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FormControl } from "@/components/ui/form";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  disabled?: boolean;
}

export function DatePicker({ date, setDate, disabled }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            className={cn(
              "w-full pl-3 text-left font-normal border-green-200 hover:bg-green-50 hover:text-green-700",
              !date && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
            variant={"outline"}
          >
            {date ? (
              format(date, "dd/MM/yyyy", { locale: vi })
            ) : (
              <span>Chọn ngày sinh</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          initialFocus
          captionLayout="dropdown-buttons"
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          fromYear={1900}
          locale={vi}
          mode="single"
          selected={date}
          toYear={new Date().getFullYear()}
          onSelect={setDate}
        />
      </PopoverContent>
    </Popover>
  );
}
