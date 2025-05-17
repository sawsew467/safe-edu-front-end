"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FileText } from "lucide-react";

import { Resource } from "@/features/resource/type";

export const columns: ColumnDef<Resource>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <div className="w-full flex gap-2 items-center text-start font-medium">
          <FileText className="text-primary" size={20} />
          {row.getValue("name")}
        </div>
      );
    },
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
];
