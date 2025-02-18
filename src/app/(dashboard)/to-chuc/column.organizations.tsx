"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

import { formatDate } from "@/utils/format-date";
import { Organization } from "@/features/organizations/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useActiveOrganizationsMutation,
  useDeleteOrganizationMutation,
} from "@/features/organizations/organization.api";
import { filterDateRange } from "@/utils/table";

interface OrganizationColumn extends Organization {
  province_name: string;
}
export const columns: ColumnDef<OrganizationColumn>[] = [
  {
    accessorKey: "image",
    cell: ({ row }) => {
      return (
        <div className="w-full">
          <Avatar className="h-16 w-16 mb-4">
            <AvatarImage alt={row.original.name} src={row.original.image} />
            <AvatarFallback>
              {row.original.name?.slice(0, 3)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      );
    },
    enableColumnFilter: false,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Tổ chức",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "province_name",
    header: "Tỉnh/ Thành phố",
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) => formatDate(row.getValue("created_at")),
    meta: {
      filterVariant: "dateRange",
    },
    filterFn: filterDateRange,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionRow row={row} />;
    },
  },
];

const ActionRow = ({ row }: { row: Row<OrganizationColumn> }) => {
  const [unActive] = useDeleteOrganizationMutation();
  const [active] = useActiveOrganizationsMutation();
  const handleDelete = async (id: string) => {
    const toastID = toast.loading("đang tạm dừng tổ chức...");

    try {
      await unActive({ id }).unwrap();

      toast.success("Tạm dừng tổ chức thành công", { id: toastID });
    } catch (err) {
      toast.error("tạm dừng tổ chức thất bại", { id: toastID });
    }
  };
  const handleActive = async (id: string) => {
    const toastID = toast.loading("đang bật hoạt động tổ chức...");

    try {
      await active({ id }).unwrap();

      toast.success("Bật hoạt động tổ chức thành công", { id: toastID });
    } catch (err) {
      toast.error("Bật hoạt động tạm dừng tổ chức thất bại", { id: toastID });
    }
  };
  const handleClick = (id: string) => {
    if (row.original.isActive) handleDelete(id);
    else handleActive(id);
  };

  return (
    <div className="flex gap-4 mt-2">
      <Link
        className="flex gap-2 w-full"
        href={`to-chuc/${row.original._id}/chinh-sua`}
      >
        <Pencil className="h-4 w-4 text-green-500" />
      </Link>

      <button
        className="flex gap-2 w-full"
        onClick={() => handleClick(row.original._id)}
      >
        {row.original?.isActive ? (
          <CrossCircledIcon className="h-4 w-4 text-red-500" />
        ) : (
          <CheckCircledIcon className="h-4 w-4 text-green-500" />
        )}
      </button>
    </div>
  );
};
