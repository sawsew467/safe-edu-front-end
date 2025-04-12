import { SVGProps, useEffect, useState } from "react";
import { vi } from "date-fns/locale";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui//button";
import { Calendar } from "@/components/ui/calendar";
export default function RangeDatePicker({ column }: any) {
  const columnFilterValue = column?.getFilterValue();

  const [startDate, setStartDate] = useState<Date | undefined>(
    columnFilterValue ? new Date(columnFilterValue?.[0]) : undefined,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    columnFilterValue ? new Date(columnFilterValue?.[1]) : undefined,
  );
  const [finished, setFinished] = useState(false);

  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return;
    setStartDate(date);
    if (endDate) {
      setFinished(true);
      if (date > endDate) setEndDate(date);
    }
  };
  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) return;
    if (startDate && date < startDate) {
      return;
    }
    setEndDate(date);
    setFinished(true);
  };

  useEffect(() => {
    if (startDate && endDate && finished) {
      column.setFilterValue([startDate?.toISOString(), endDate?.toISOString()]);
    }
  }, [startDate, endDate]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="flex-1 justify-start font-normal"
              variant="outline"
            >
              {startDate ? startDate?.toLocaleDateString() : "Ngày bắt đầu"}
              <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50 hover:opacity-100" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              locale={vi}
              mode="single"
              required={false}
              selected={startDate as Date}
              onSelect={handleStartDateChange}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="flex-1 justify-start font-normal"
              disabled={!startDate}
              variant="outline"
            >
              {endDate ? endDate?.toLocaleDateString() : "Ngày kết thúc"}
              <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50 hover:opacity-100" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              required
              locale={vi}
              mode="single"
              selected={endDate as Date}
              onSelect={handleEndDateChange}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function CalendarDaysIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect height="18" rx="2" width="18" x="3" y="4" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}
