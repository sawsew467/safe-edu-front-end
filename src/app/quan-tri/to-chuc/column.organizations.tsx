"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Eye, Pencil } from "lucide-react";
import { toast } from "sonner";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import React from "react";
import Link from "next/link";

import { formatDate } from "@/utils/format-date";
import { Organization } from "@/features/organizations/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useActiveOrganizationsMutation,
  useDeleteOrganizationMutation,
} from "@/features/organizations/organization.api";
import { filterDateRange } from "@/utils/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormEditOrganizations from "@/features/organizations/components/form-edit-new-organizations";
import { Status } from "@/settings/enums";

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
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          {row.getValue("status") === Status.unActive ? (
            <>
              <CrossCircledIcon className="h-4 w-4 text-red-500" />
              <span className="text-red-500">{"Tạm dừng"}</span>
            </>
          ) : (
            <>
              <CheckCircledIcon className="h-4 w-4 text-green-500" />
              <span className="text-green-500">{"Hoạt động"}</span>
            </>
          )}
        </div>
      );
    },
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
  const [isopen, setOpenDialog] = React.useState(false);
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          variant="ghost"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">{"mở"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Dialog open={isopen}>
            <DialogTrigger className="w-full">
              <Link
                className="flex gap-2 px-2 py-1 justify-start w-full"
                href={`to-chuc/${row.original._id}`}
              >
                <Eye className="h-4 w-4 text-blue-500" />
                {<span className="">{"Xem"}</span>}
              </Link>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Chỉnh sửa tổ chức</DialogTitle>
              <FormEditOrganizations
                id={row.original._id}
                setOpenDialog={setOpenDialog}
              />
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Dialog open={isopen} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild className="w-full">
              <Button
                className="flex gap-2 px-2 py-1 justify-start w-full"
                variant="ghost"
                onClick={() => setOpenDialog(true)}
              >
                <Pencil className="h-4 w-4 text-green-500" />
                {<span className="">{"Thay đổi"}</span>}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Chỉnh sửa tổ chức</DialogTitle>
              <FormEditOrganizations
                id={row.original._id}
                setOpenDialog={setOpenDialog}
              />
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Button
            className="flex gap-2 cursor-pointer w-full px-2 py-1 justify-start"
            variant="ghost"
            onClick={() => handleClick(row.original._id)}
          >
            {row.original?.isActive ? (
              <>
                <CrossCircledIcon className="h-4 w-4 text-red-500" />
                <span className="">{"Tạm dừng"}</span>
              </>
            ) : (
              <>
                <CheckCircledIcon className="h-4 w-4 text-green-500" />
                <span className="">{"Hoạt động"}</span>
              </>
            )}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
