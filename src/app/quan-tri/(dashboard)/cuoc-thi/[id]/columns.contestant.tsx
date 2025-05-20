"use client";

import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { Eye } from "lucide-react";
import Link from "next/link";

import { isImageLink } from "@/utils/checkimage";
import { Student } from "@/features/users/user.types";
import { Organization } from "@/features/organizations/types";
import { formatDate } from "@/utils/format-date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "avatar",
    header: "Ảnh đại diện",
    cell: ({ row }) => {
      const image: string | null = isImageLink(row.getValue("avatar"))
        ? row.getValue("avatar")
        : null;

      return image ? (
        <Image
          alt={`Ảnh đại diện của ${row.original?.full_name}`}
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
    accessorKey: "organizationId",
    header: "Tổ chức",
    cell: ({ row }) => {
      const organization: Organization = row.getValue(
        "organizationId"
      ) as Organization;

      return organization?.isActive ? (
        <div className="">
          <div className="font-medium">{organization?.name}</div>
        </div>
      ) : (
        <p className="text-red-500">*Học sinh này không thuộc tổ chức nào</p>
      );
    },
  },
  {
    accessorKey: "phone_number",
    header: "SDT",
  },
  {
    accessorKey: "date_of_birth",
    header: "Ngày sinh",
    cell: ({ row }) => {
      const dob: string = row.getValue("date_of_birth");

      return <p>{formatDate(dob)}</p>;
    },
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
            "text-red-500": status?.value === "inactive",
            "text-green-500": status?.value === "active",
          })}
        >
          {status?.value === "active" ? (
            <CheckCircledIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          ) : (
            <CrossCircledIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status?.label}</span>
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
    cell: ({ row }) => (
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
              className="flex gap-2 w-full items-center"
              href={`/quan-tri/nguoi-dung/hoc-sinh/${row.original?.id}`}
            >
              <Eye className="w-4 h-4 text-blue-500" />
              {<span className="">{"Xem thông tin"}</span>}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
