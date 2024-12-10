"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Library } from "@/features/users/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Library>[] = [
  {
    accessorKey: "title",
    header: "Tiêu đề",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("title")}</div>;
    },
  },
  {
    accessorKey: "author",
    header: "Tác giả",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "icon",
    header: "Ảnh biểu tượng",
    cell: ({ row }) => {
      return (
        <Image alt="icon" height={100} src={row.getValue("icon")} width={100} />
      );
    },
  },
  {
    accessorKey: "desc",
    header: "Mô tả",
    cell: ({ row }) => {
      return (
        <Link
          className="flex gap-1"
          href={`thu-vien/${row.original.slug}/mo-ta`}
        >
          <Eye className="w-4 h-4 text-blue-500" />
          {<span className="">{"Xem"}</span>}
        </Link>
      );
    },
  },
  {
    accessorKey: "otherInformation",
    header: "Thông tin khác",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              variant="ghost"
            >
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">{"Open Menu"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="w-4 h-4 text-blue-500" />
              {<span className="">{"Xem"}</span>}
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Link
                className="flex gap-2"
                href={`thu-vien/thay-doi-bai-viet/${row.original.slug}`}
              >
                <Pencil className="h-4 w-4 text-green-500" />
                {<span className="">{"Thay đổi"}</span>}
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Trash2 className="h-4 w-4 text-red-500" />
              {<span className="">{"Xóa"}</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
