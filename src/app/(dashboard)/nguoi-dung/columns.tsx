"use client";

import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { User } from "@/features/users/types";
import { usersRole, usersStatus } from "@/features/users/definitions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "userName",
    header: "Họ và tên",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("userName")}</div>;
    },
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
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
    accessorKey: "role",
    header: "Quyền",
    cell: ({ row }) => {
      const role = usersRole.find(
        (role) => role.value === row.getValue("role"),
      );

      if (!role) {
        // If a value is not what you expect or does not exist you can return null.
        return null;
      }

      return <span>{role.label}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "rtn",
    header: "RTN",
  },
  {
    accessorKey: "otherInformation",
    header: "Thông tin khác",
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = usersStatus.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div
          className={clsx("flex w-[100px] items-center", {
            "text-red-500": status.value === "inactive",
            "text-green-500": status.value === "active",
          })}
        >
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
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
            <Eye className="w-4 h-4 text-blue-500" />
            {<span className="">{"View"}</span>}
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Pencil className="h-4 w-4 text-green-500" />
            {<span className="">{"Update"}</span>}
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Trash2 className="h-4 w-4 text-red-500" />
            {<span className="">{"Delete"}</span>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
