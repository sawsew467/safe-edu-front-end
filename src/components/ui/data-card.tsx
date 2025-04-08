import React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDownUp, Filter } from "lucide-react";

import { Card } from "./card";
import { Spinner } from "./spinner";

import FilterModal from "@/components/ui/filter-table";
import SortModal from "@/components/ui/sort-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onRowClick?: ({ data }: { data: TData }) => void;
}

export default function CardList<TData, TValue>({
  columns,
  data,
  isLoading,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  "use no memo";
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: { sorting, globalFilter, columnFilters, pagination },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  });

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <Input
          className="flex-1 max-w-96"
          placeholder="tìm kiếm tổ chức..."
          type="search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
        <div className="flex gap-2">
          <FilterModal
            opener={
              <Button variant={columnFilters?.length ? "default" : "secondary"}>
                <Filter className="h-4 w-4" />
              </Button>
            }
            table={table}
          />
          <SortModal
            opener={
              <Button variant={sorting?.length ? "default" : "secondary"}>
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            }
            table={table}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="flex w-full items-center justify-center py-10">
          <Spinner className="size-24" color="primary" />
        </div>
      ) : table?.getRowModel()?.rows?.length ? (
        <div className="grid mb-8 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {table?.getRowModel()?.rows?.map((row) => {
            const record = row.original;

            return (
              <Card
                key={row.id}
                className={cn("p-4", onRowClick && "cursor-pointer")}
                onClick={() => {
                  if (onRowClick)
                    onRowClick({
                      data: record,
                    });
                }}
              >
                <div className="space-y-2 h-full flex flex-col justify-between">
                  {row?.getVisibleCells()?.map((cell) => {
                    return (
                      <div key={cell.id} className="flex justify-between ">
                        {typeof cell.column.columnDef.header === "string" && (
                          <div className="flex-1 text-base font-bold">
                            {cell.column.columnDef.header} :
                          </div>
                        )}
                        <div className="flex flex-1 justify-end text-end text-base">
                          {flexRender(
                            cell?.column?.columnDef?.cell,
                            cell?.getContext(),
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-4">
          Không tìm thấy dữ liệu
        </p>
      )}
      {!isLoading && table?.getRowModel()?.rows?.length !== 0 && (
        <DataTablePagination table={table} />
      )}
    </div>
  );
}
