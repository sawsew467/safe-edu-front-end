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
import { isImageLink } from "@/utils/checkimage";
import { Province, Supervision } from "@/features/users/user.types";
import {
  useActiveSupervisionMutation,
  useDeleteSupervisionMutation,
} from "@/features/users/api/supervison.api";

export const columns: ColumnDef<Supervision>[] = [
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
          unoptimized={true}
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
    accessorKey: "province_id",
    header: "Tỉnh / thành phố",
    cell: ({ row }) => {
      const provinces: Province[] = row.getValue("province_id");

      return provinces?.length > 0 ? (
        <div className="">
          {provinces?.map((province: Province) => (
            <div key={province?._id} className="font-medium">
              {province?.name}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-500">
          *Quan sát viên này không quan sát tỉnh / thành phố nào
        </p>
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

const Action = ({ row }: { row: Row<Supervision> }) => {
  const [unActiveSupervision] = useDeleteSupervisionMutation();
  const [ActiveSupervision] = useActiveSupervisionMutation();
  const handleUnActiveSupervision = async (id: string) => {
    const toastID = toast.loading("Đang tạm dừng tài khoản...");

    try {
      await unActiveSupervision({ id }).unwrap();
      toast.success("Tạm dừng thành công", {
        id: toastID,
      });
    } catch (err) {
      toast.error("Tạm dừng thất bại", { id: toastID });
    }
  };
  const handleActiveSupervision = async (id: string) => {
    const toastID = toast.loading("Đang mở lại tài khoản...");

    try {
      await ActiveSupervision({
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
  const handleSupervision = async (id: string) => {
    if (row.original?.isActive) handleUnActiveSupervision(id);
    else handleActiveSupervision(id);
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
            href={`nguoi-dung/quan-sat-vien/${row.original?.id}`}
          >
            <Eye className="w-4 h-4 text-blue-500" />
            {<span className="">{"Xem thông tin"}</span>}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            className="flex gap-2 w-full items-center"
            onClick={() => handleSupervision(row.original?.id)}
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
