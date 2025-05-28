"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Zod schema để validate ngày tháng năm
const dateFormSchema = z
  .object({
    day: z.string().min(1, { message: "Vui lòng chọn ngày" }),
    month: z.string().min(1, { message: "Vui lòng chọn tháng" }),
    year: z.string().min(1, { message: "Vui lòng chọn năm" }),
  })
  .refine(
    (data) => {
      // Kiểm tra ngày hợp lệ
      const day = Number.parseInt(data.day);
      const month = Number.parseInt(data.month);
      const year = Number.parseInt(data.year);

      // Tạo Date object để kiểm tra tính hợp lệ
      const date = new Date(year, month - 1, day);

      // Kiểm tra xem ngày có hợp lệ không
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    },
    {
      message: "Ngày tháng năm không hợp lệ",
      path: ["day"], // Hiển thị lỗi ở field day
    },
  );

type DateFormValues = z.infer<typeof dateFormSchema>;

export default function DateInputForm({
  value,
  onChange,
}: {
  value?: Date;
  onChange?: (date: Date) => void;
}) {
  const form = useForm<DateFormValues>({
    resolver: zodResolver(dateFormSchema),
    defaultValues: {
      day: "",
      month: "",
      year: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (value) {
      form.reset({
        day: value.getDate().toString(),
        month: (value.getMonth() + 1).toString(),
        year: value.getFullYear().toString(),
      });
    } else {
      form.reset({
        day: new Date().getDate().toString(),
        month: (new Date().getMonth() + 1).toString(),
        year: new Date().getFullYear().toString(),
      });
    }
  }, [value]);

  function onSubmit(values: DateFormValues) {
    const selectedDate = new Date(
      Number.parseInt(values.year),
      Number.parseInt(values.month) - 1,
      Number.parseInt(values.day),
    );

    onChange?.(selectedDate);
  }

  // Tạo danh sách ngày (1-31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

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

  // Ensure day is valid for selected month/year
  useEffect(() => {
    const selectedDay = Number(form.watch("day"));
    const selectedMonth = Number(form.watch("month"));
    const selectedYear = Number(form.watch("year"));

    const isLeapYear = (year: number) =>
      year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

    let daysInMonth = 31;

    if (selectedMonth === 2) {
      daysInMonth = isLeapYear(selectedYear) ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(selectedMonth)) {
      daysInMonth = 30;
    }

    if (selectedDay > daysInMonth) {
      form.setValue("day", "");
    }
  }, [form.watch("month"), form.watch("year")]);

  return (
    <Form {...form}>
      <form className="space-y-6" onChange={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-4">
          {/* Select Ngày */}
          <FormField
            control={form.control}
            name="day"
            render={({ field }) => (
              <FormItem>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger type="button">
                      <SelectValue
                        placeholder={field.value ? field.value : "Ngày"}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(() => {
                      const selectedMonth = Number(form.watch("month"));
                      const selectedYear = Number(form.watch("year"));

                      const isLeapYear = (year: number) =>
                        year % 4 === 0 &&
                        (year % 100 !== 0 || year % 400 === 0);

                      let daysInMonth = 31;

                      if (selectedMonth === 2) {
                        daysInMonth = isLeapYear(selectedYear) ? 29 : 28;
                      } else if ([4, 6, 9, 11].includes(selectedMonth)) {
                        daysInMonth = 30;
                      }

                      return Array.from(
                        { length: daysInMonth },
                        (_, i) => i + 1,
                      ).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger type="button">
                      <SelectValue
                        placeholder={field.value ? field.value : "Tháng"}
                      />
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select Năm */}
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={field.value ? field.value : "Năm"}
                      />
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
