"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import clsx from "clsx";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Eye } from "lucide-react";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Manager } from "@/features/users/user.types";
import { Organization } from "@/features/organizations/types";
import {
  useActiveManagerMutation,
  useDeleteManagerMutation,
} from "@/features/users/api/manager.api";

export const columns: ColumnDef<Manager>[] = [
  {
    accessorKey: "avatar",
    header: "Ảnh đại diện",
    cell: ({ row }) => {
      const image: string | null = row.getValue("avatar");

      return image ? (
        <Image
          alt={`Ảnh đại diện của ${row.original?.full_name}`}
          className="rounded-full"
          height={48}
          src={image}
          unoptimized={true}
          width={48}
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
    header: "Thuộc tổ chức",
    cell: ({ row }) => {
      const organizations: Organization[] = row.getValue("organizationId");

      if (!organizations?.length) {
        return <p className="text-red-500">*Không thuộc tổ chức nào</p>;
      }

      return organizations.map((organization) => (
        <div key={organization.id} className="">
          <div className="font-medium">{organization?.name}</div>
        </div>
      ));
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
    cell: ({ row }) => <Action row={row} />,
  },
];

const Action = ({ row }: { row: Row<Manager> }) => {
  const [unActiveManager] = useDeleteManagerMutation();
  const [ActiveManager] = useActiveManagerMutation();
  const handleUnActiveManager = async (id: string) => {
    const toastID = toast.loading("Đang tạm dừng tài khoản...");

    try {
      await unActiveManager({ id }).unwrap();
      toast.success("Tạm dừng thành công", {
        id: toastID,
      });
    } catch (err) {
      toast.error("Tạm dừng thất bại", { id: toastID });
    }
  };
  const handleActiveManager = async (id: string) => {
    const toastID = toast.loading("Đang mở lại tài khoản...");

    try {
      await ActiveManager({
        params: { id },
        body: { isActive: true },
      }).unwrap();
      toast.success("Mở lại thành công", {
        id: toastID,
      });
    } catch (err) {
      toast.error("Mở lại thất bại", { id: toastID });
    }
  };
  const handleManager = async (id: string) => {
    if (row.original.isActive) handleUnActiveManager(id);
    else handleActiveManager(id);
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
            className="flex gap-2 w-full items-center"
            href={`nguoi-dung/quan-li-vien/${row.original?.id}`}
          >
            <Eye className="w-4 h-4 text-blue-500" />
            {<span className="">{"Xem thông tin"}</span>}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            className="flex gap-2 w-full items-center items-center"
            onClick={() => handleManager(row.original?.id)}
          >
            {row.original?.isActive ? (
              <CrossCircledIcon className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircledIcon className="h-4 w-4 text-green-500" />
            )}
            {
              <span className="">
                {row.original?.isActive ? "Khoá tài khoản" : "Mở lại tài khoản"}
              </span>
            }
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
