import React, { ReactNode } from "react";
import {
  ArrowDownNarrowWide,
  ArrowUpDown,
  ArrowUpNarrowWide,
} from "lucide-react";
import { flexRender, Table } from "@tanstack/react-table";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

function SortModal({
  opener,
  table,
}: {
  opener: ReactNode;
  table: Table<any>;
}) {
  "use no memo";

  return (
    <Dialog>
      <DialogTrigger asChild>{opener}</DialogTrigger>
      <DialogContent className="flex h-[80vh] flex-col sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sắp xếp theo</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          {table.getHeaderGroups().map((headerEl) => {
            return (
              <div key={headerEl.id} className="grid gap-4">
                {headerEl.headers
                  .filter((header) => header.column.getCanSort())
                  .map((columnEl) => {
                    return (
                      <Button
                        key={columnEl.id}
                        className="w-full justify-between font-normal"
                        variant="ghost"
                        onClick={columnEl.column.getToggleSortingHandler()}
                      >
                        <span className="font-medium">
                          {flexRender(
                            columnEl.column.columnDef.header,
                            columnEl.getContext(),
                          )}
                        </span>
                        {!columnEl.column.getIsSorted() && (
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                        {columnEl.column.getIsSorted() === "asc" && (
                          <ArrowUpNarrowWide className="ml-2 h-4 w-4" />
                        )}
                        {columnEl.column.getIsSorted() === "desc" && (
                          <ArrowDownNarrowWide className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    );
                  })}
              </div>
            );
          })}
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button>Đóng</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SortModal;
