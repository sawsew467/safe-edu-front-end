"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import clsx from "clsx";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { isImageLink } from "@/utils/checkimage";
import { Admin } from "@/features/users/user.types";

export const columns: ColumnDef<Admin>[] = [
  {
    accessorKey: "avatar",
    header: "Ảnh đại diện",
    cell: ({ row }) => {
      const image: string | null = isImageLink(row.getValue("avatar"))
        ? row.getValue("avatar")
        : null;

      return image ? (
        <Image
          alt={`Ảnh đại diện của ${row.original.full_name}`}
          className="rounded-full"
          height={100}
          src={image}
          width={100}
        />
      ) : (
        <p className="text-red-500">*không tìm thấy ảnh đại diện</p>
      );
    },
  },
  {
    accessorKey: "full_name",
    header: "Họ và tên",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("full_name")}</div>;
    },
  },
  {
    accessorKey: "phone_number",
    header: "Số điện thoại",
    cell: ({ row }) => {
      const phone_number: string = row.getValue("phone_number");

      return phone_number ? (
        <div className="font-medium">{phone_number}</div>
      ) : (
        <p className="text-red-500">*không tìm thấy sdt</p>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "location",
    header: "Địa chỉ",
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("isActive")
        ? { value: "active", label: "Hoạt động" }
        : { value: "inactive", label: "Tạm dừng" };

      return (
        <div
          className={clsx("flex w-[100px] items-center", {
            "text-red-500": status.value === "inactive",
            "text-green-500": status.value === "active",
          })}
        >
          {status.value === "active" ? (
            <CheckCircledIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          ) : (
            <CrossCircledIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    meta: {},
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <Action row={row} />,
  },
];

const Action = ({ row }: { row: Row<Admin> }) => {
  const handleDeleteNews = (id: string) => {
    console.log("id", id);
  };

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
          <Link
            className="flex gap-2 w-full"
            href={`nguoi-dung/${row.original.id}`}
          >
            <Eye className="w-4 h-4 text-blue-500" />
            {<span className="">{"Xem"}</span>}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            className="flex gap-2 w-full"
            href={`nguoi-dung/${row.original.id}/chinh-sua`}
          >
            <Pencil className="h-4 w-4 text-green-500" />
            {<span className="">{"Thay đổi"}</span>}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <button
            className="flex gap-2 w-full"
            onClick={() => handleDeleteNews(row.original.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
            {<span className="">{"Xóa"}</span>}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};