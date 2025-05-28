"use client";

import { useEffect, useState } from "react";

import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DateInputForm({
  value,
  onChange,
}: {
  value?: Date;
  onChange?: (date: Date) => void;
}) {
  const [[day, month, year], setDate] = useState([
    new Date().getDate().toString(),
    (new Date().getMonth() + 1).toString(),
    new Date().getFullYear().toString(),
  ]);

  useEffect(() => {
    if (value) {
      setDate([
        value.getDate().toString(),
        (value.getMonth() + 1).toString(),
        value.getFullYear().toString(),
      ]);
    }
  }, [value]);

  // Tạo danh sách ngày (1-31)

  // Tạo danh sách tháng
  const months = [
    { value: "1", label: "Tháng 1" },
    { value: "2", label: "Tháng 2" },
    { value: "3", label: "Tháng 3" },
    { value: "4", label: "Tháng 4" },
    { value: "5", label: "Tháng 5" },
    { value: "6", label: "Tháng 6" },
    { value: "7", label: "Tháng 7" },
    { value: "8", label: "Tháng 8" },
    { value: "9", label: "Tháng 9" },
    { value: "10", label: "Tháng 10" },
    { value: "11", label: "Tháng 11" },
    { value: "12", label: "Tháng 12" },
  ];

  // Tạo danh sách năm (từ 1950 đến năm hiện tại + 10)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1950 + 11 },
    (_, i) => currentYear + 10 - i,
  );

  useEffect(() => {
    const selectedDay = Number(day);
    const selectedMonth = Number(month);
    const selectedYear = Number(year);
    const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);

    onChange?.(selectedDate);
  }, [day, month, year]);

  // Ensure day is valid for selected month/year
  useEffect(() => {
    const selectedDay = Number(day);
    const selectedMonth = Number(month);
    const selectedYear = Number(year);
    const isLeapYear = (year: number) =>
      year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

    let daysInMonth = 31;

    if (selectedMonth === 2) {
      daysInMonth = isLeapYear(selectedYear) ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(selectedMonth)) {
      daysInMonth = 30;
    }

    if (selectedDay > daysInMonth) {
      setDate(["", month, year]); // Reset day if invalid
    }
  }, [month, year]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Select Ngày */}
      <Select
        value={day}
        onValueChange={(selectedDay) => {
          setDate([selectedDay, month, year]);
        }}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={day || "Ngày"} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {(() => {
            const selectedMonth = Number(month);
            const selectedYear = Number(year);

            const isLeapYear = (year: number) =>
              year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

            let daysInMonth = 31;

            if (selectedMonth === 2) {
              daysInMonth = isLeapYear(selectedYear) ? 29 : 28;
            } else if ([4, 6, 9, 11].includes(selectedMonth)) {
              daysInMonth = 30;
            }

            return Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
              (day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day}
                </SelectItem>
              ),
            );
          })()}
        </SelectContent>
      </Select>

      <Select
        value={month}
        onValueChange={(selectedMonth) => {
          setDate([day, selectedMonth, year]);
        }}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={month ? `Tháng ${month}` : "Tháng"} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Select Năm */}
      <Select
        defaultValue={year}
        onValueChange={(selectedYear) => {
          setDate([day, month, selectedYear]);
          onChange?.(
            new Date(Number(selectedYear), Number(month) - 1, Number(day)),
          );
        }}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={year || "Năm"} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
