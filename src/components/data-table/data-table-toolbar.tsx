"use client";
"use no memo";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usersStatus } from "@/features/users/definitions";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          className="h-8 w-[150px] lg:w-[250px]"
          placeholder={"Filter"}
          value={
            (table.getColumn("userName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("userName")?.setFilterValue(event.target.value)
          }
        />

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            options={usersStatus}
            title={"Status"}
          />
        )}

        {isFiltered && (
          <Button
            className="h-8 px-2 lg:px-3"
            variant="outline"
            onClick={() => table.resetColumnFilters()}
          >
            {"Clean Filters"}
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
