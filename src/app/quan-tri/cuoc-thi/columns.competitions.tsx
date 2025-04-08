import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
  TimerIcon,
} from "@radix-ui/react-icons";
import { Eye, Pencil } from "lucide-react";
import { toast } from "sonner";
import React from "react";
import Link from "next/link";

import { Competitions } from "@/features/competitions/type.competitions";
import { isImageLink } from "@/utils/checkimage";
import { formatDate } from "@/utils/format-date";
import { filterDateRange } from "@/utils/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { StatusCompetition, StatusCompetitionVN } from "@/settings/enums";
import { useDeleteCompetitionsMutation } from "@/features/competitions/api.competitions";

export interface ColumnCompetitions
  extends Omit<Competitions, "organizations"> {
  organizations: string;
}

export const columns: ColumnDef<ColumnCompetitions>[] = [
  {
    accessorKey: "image_url",
    cell: ({ row }) => {
      const image: string | null = isImageLink(row.getValue("image_url"))
        ? row.getValue("image_url")
        : row.getValue("image_url");

      return image ? (
        <div className="w-full h-52">
          <Image
            alt={`Ảnh có thể nói về ${row.original.title}`}
            className="object-cover w-full h-full"
            height={300}
            src={image}
            width={400}
          />
        </div>
      ) : (
        <p className="text-red-500 w-full flex justify-center items-center size-24">
          * không tìm thấy ảnh
        </p>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "title",
    cell: ({ row }) => (
      <p className="flex w-full justify-center text-lg">
        {row.getValue("title")}
      </p>
    ),
    meta: {
      filterVariant: "search",
    },
  },
  {
    accessorKey: "description",

    cell: ({ row }) => (
      <p className="flex w-full justify-start mb-2 text-sm">
        {row.getValue("description")}
      </p>
    ),
    meta: {
      filterVariant: "search",
    },
  },
  {
    accessorKey: "organizations",
    header: "Tổ chức",
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => getStatus(row),
    enableSorting: false,
    enableGlobalFilter: false,
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "create_at",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const createDate = formatDate(
        row.original.updated_at ?? row.getValue("created_at"),
      );

      return <p>{createDate}</p>;
    },
    meta: {
      filterVariant: "dateRange",
    },
    filterFn: filterDateRange,
  },
  {
    header: "Các ngày diễn ra",
    cell: ({ row }) => {
      const startDate = formatDate(row.original.startDate, "DD/MM/yyyy");
      const endDate = formatDate(row.original.endDate, "DD/MM/yyyy");

      return (
        <div className="space-y-2">
          <p>
            {startDate} - {endDate}
          </p>
        </div>
      );
    },
    meta: {
      filterVariant: "dateRange",
    },
    filterFn: filterDateRange,
  },
  {
    accessorKey: "create_by",
    header: "Người tạo",
    meta: {
      filterVariant: "search",
    },
  },
  {
    accessorKey: "number_join",
    header: "Tổng người tham gia",
    meta: {
      filterVariant: "numberRange",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => Action(row),
  },
];

const getStatus = (row: Row<ColumnCompetitions>) => {
  const status = {
    value: row.original.status as keyof typeof StatusCompetitionVN,
    label: row.original.status as keyof typeof StatusCompetitionVN,
  };

  console.log("status", status);

  switch (status?.value) {
    case StatusCompetition.Upcoming:
      return (
        <div className="flex items-center text-yellow-500">
          <TimerIcon className="mr-2 h-4 w-4 text-yellow-500" />
          <p className="text-sm">{status?.label}</p>
        </div>
      );
    case StatusCompetition.Outgoing:
      return (
        <div className="flex items-center text-red-500">
          <CrossCircledIcon className="mr-2 h-4 w-4 text-red-500" />
          <p className="text-sm">{status?.label}</p>
        </div>
      );
    case StatusCompetition.Ongoing:
      return (
        <div className="flex items-center text-green-500">
          <CheckCircledIcon className="mr-2 h-4 w-4 text-green-500" />
          <p className="text-sm">{status?.label}</p>
        </div>
      );
    default:
      return (
        <div className="flex items-center text-red-500">
          <CheckCircledIcon className="mr-2 h-4 w-4 text-red-500" />
          <p className="text-sm">Đã kết thúc</p>
        </div>
      );
  }
};

const Action = (row: Row<ColumnCompetitions>) => {
  const [deleteNews] = useDeleteCompetitionsMutation();
  const handleDeleteCompetitions = async (id: string) => {
    const toastID = toast.loading("đang xóa bài báo...");

    try {
      await deleteNews({ id }).unwrap();

      toast.success("Xóa bài báo thành công", { id: toastID });
    } catch (err) {
      toast.error("Xóa bài báo thất bại", { id: toastID });
    }
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
          <Link
            className="cursor-pointer flex gap-2 px-2 py-1 justify-start w-full"
            href={`cuoc-thi/${row.original._id}`}
          >
            <Eye className="h-4 w-4 text-blue-500" />
            {<span className="">{"Xem"}</span>}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            className="cursor-pointer flex gap-2 px-2 py-1 justify-start w-full"
            href={`cuoc-thi/${row.original._id}/thay-doi`}
          >
            <Pencil className="h-4 w-4 text-green-500" />
            {<span className="">{"Thay đổi"}</span>}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            className="flex gap-2 cursor-pointer w-full px-2 py-1 justify-start"
            variant="ghost"
            onClick={() => handleDeleteCompetitions(row.original._id)}
          >
            {row.original?.isActive ? (
              <>
                <CrossCircledIcon className="h-4 w-4 text-red-500" />
                <span className="">{"Tạm dừng"}</span>
              </>
            ) : (
              <>
                <CheckCircledIcon className="h-4 w-4 text-green-500" />
                <span className="">{"Hoạt động lại"}</span>
              </>
            )}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
