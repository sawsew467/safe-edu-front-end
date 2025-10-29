import React, { ChangeEvent, ReactNode, useState } from "react";
import { ChevronLeft } from "lucide-react";
import {
  Column,
  ColumnDefTemplate,
  flexRender,
  Header,
  HeaderContext,
  Table,
} from "@tanstack/react-table";

import RangeNumberPicker from "./rate-number-picker";

import RangeDatePicker from "@/components/ui/range-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function FilterModal<TData, TValue>({
  opener,
  table,
}: {
  opener: ReactNode;
  table: Table<any>;
}) {
  const [activeFilter, setActiveFilter] = useState<
    ColumnDefTemplate<HeaderContext<any, unknown>> | undefined | null
  >(null);
  const [currentColumn, setCurrentColumn] = useState<Column<
    TData,
    TValue
  > | null>(null);
  const [currentHeader, setHeader] = useState<Header<TData, TValue> | null>(
    null,
  );

  const handleReset = () => {
    table.resetColumnFilters();
    setActiveFilter(null);
    setCurrentColumn(null);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{opener}</DialogTrigger>
        <DialogContent className="flex h-[80vh] flex-col sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {activeFilter ? (
                <div className="flex w-full">
                  <Button
                    className="flex items-center px-4 font-normal"
                    variant="ghost"
                    onClick={() => setActiveFilter(null)}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    <span className="font-medium">{`Filter ${activeFilter}`}</span>
                  </Button>
                </div>
              ) : (
                <span className="font-medium">Tùy chọn bộ lọc</span>
              )}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-grow">
            {!activeFilter ? (
              <div className="grid gap-2 py-4">
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header: any) => {
                    return (
                      header.column.getCanFilter() && (
                        <Button
                          key={header.id}
                          className="justify-between"
                          variant="outline"
                          onClick={() => {
                            setActiveFilter(header.column.columnDef.header);
                            setCurrentColumn(header.column);
                            setHeader(header);
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getFilterValue() && (
                            <Badge>Thiếp lập</Badge>
                          )}
                        </Button>
                      )
                    );
                  }),
                )}
              </div>
            ) : (
              <div className="py-4">
                <FilterItem
                  column={currentColumn as Column<TData, TValue>}
                  header={currentHeader as Header<TData, TValue>}
                  table={table}
                />
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <div className="grid grid-cols-2 gap-4">
              <DialogClose asChild>
                <Button variant="outline" onClick={handleReset}>
                  Cài lại
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Đóng</Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const FilterItem = <TData, TValue>({
  column,
  header,
  table,
}: {
  column: Column<TData, TValue>;
  header: Header<TData, TValue>;
  table: Table<TData>;
}) => {
  const { filterVariant }: any = column?.columnDef.meta ?? {};

  const columnFilterValue = column?.getFilterValue();

  const sortedUniqueValues: string[] = React.useMemo(
    () =>
      filterVariant === "range"
        ? []
        : (Array.from(column.getFacetedUniqueValues().keys())
            ?.filter((value) => value)
            .sort()
            .slice(0, 5000) as string[]),
    [column.getFacetedUniqueValues(), filterVariant],
  );
  const headerfn = flexRender(
    header.column.columnDef.header,
    header.getContext(),
  );

  switch (filterVariant) {
    case "select":
      return (
        <>
          <Label className="mb-2 block">{headerfn}</Label>
          <Select
            value={columnFilterValue?.toString()}
            onValueChange={(e: string) => {
              if (e === "none") {
                column.setFilterValue(undefined);
              } else {
                // For alertLevel column, we need to pass the value as string to match the filterFn
                column.setFilterValue(e);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Chọn một trường`} />
            </SelectTrigger>
            <SelectContent>
              {sortedUniqueValues.map((value: string) => (
                <SelectItem key={value} value={value}>
                  {value || "Tất cả"}
                </SelectItem>
              ))}
              <SelectItem key={"Tất cả"} value={"none"}>
                {"Tất cả"}
              </SelectItem>
            </SelectContent>
          </Select>
        </>
      );

    case "dateRange":
      return (
        <>
          <Label className="mb-2 block">{headerfn}</Label>
          <RangeDatePicker column={column} />
        </>
      );
    case "numberRange":
      const values: Array<number> = table
        .getRowModel()
        ?.rows.map((row) => row.getValue(column.id));
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);

      return (
        <>
          <Label className="mb-2 block">{headerfn}</Label>
          <RangeNumberPicker
            column={column}
            initialMaxValue={maxValue}
            initialMinValue={minValue}
          />
        </>
      );
    default:
      return (
        <>
          <Label className="mb-2 block">{headerfn}</Label>
          <Input
            placeholder={`Search ${column.columnDef.header}`}
            value={columnFilterValue as string}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              column.setFilterValue(e.target.value)
            }
          />
        </>
      );
  }
};

export default FilterModal;
