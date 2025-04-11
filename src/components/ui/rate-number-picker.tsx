"use client";

import { useEffect, useState } from "react";
import { Column } from "@tanstack/react-table";

import { MultipleSlider } from "./mutiple-slider";

import { Input } from "@/components/ui/input";

interface Props<TData, TValue> {
  column: Column<TData, TValue>;
  initialMinValue: number;
  initialMaxValue: number;
}

export default function RangeNumberPicker<TData, TValue>({
  column,
  initialMinValue,
  initialMaxValue,
}: Props<TData, TValue>) {
  "use no memo";
  const columnFilterValue: any = column?.getFilterValue();

  const [value, setValue] = useState<[number | undefined, number | undefined]>(
    columnFilterValue
      ? [columnFilterValue[0] as number, columnFilterValue[1] as number]
      : [undefined, undefined],
  );

  const minValue = value?.[0];
  const maxValue = value?.[1];

  const handleMinValueChange = (value: number | undefined) => {
    if (value === undefined && typeof value !== "number") return;
    if (maxValue !== undefined && value > maxValue) {
      setValue((prev) => [value, prev?.at(1)]);
    }
  };

  const handleMaxValueChange = (value: number | undefined) => {
    if (value === undefined && typeof value !== "number") return;
    if (minValue !== undefined && value < minValue) {
      return;
    }
    setValue((prev) => [prev?.at(0), value]);
  };
  const handleValueChange = (
    values: [number | undefined, number | undefined],
  ) => {
    if (values?.some((value) => value === undefined)) return;

    setValue(values);
  };

  useEffect(() => {
    if (minValue !== undefined && maxValue !== undefined) {
      column.setFilterValue([minValue, maxValue]);
    }
  }, [minValue, maxValue, column]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div>
          <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <Input
              placeholder="Nhập giá trị nhỏ nhất"
              type="text"
              value={minValue ?? ""}
              onChange={(e) => handleMinValueChange(e.target.valueAsNumber)}
            />
            <Input
              placeholder="Nhập giá trị lớn nhất"
              type="text"
              value={maxValue ?? ""}
              onChange={(e) => handleMaxValueChange(e.target.valueAsNumber)}
            />
          </div>
          <MultipleSlider
            max={initialMaxValue ?? 1000}
            min={initialMinValue ?? 0}
            value={[minValue ?? 0, maxValue ?? 100]}
            onValueChange={(values) =>
              handleValueChange(values as [number, number])
            }
          />
        </div>
      </div>
    </div>
  );
}
