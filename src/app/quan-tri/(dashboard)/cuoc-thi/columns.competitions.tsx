import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  TimerIcon,
} from "@radix-ui/react-icons";
import React from "react";
import { Ban } from "lucide-react";

import { Competitions } from "@/features/competitions/type.competitions";
import { isImageLink } from "@/utils/checkimage";
import { formatDate } from "@/utils/format-date";
import { filterDateRange } from "@/utils/table";
import { StatusCompetition, StatusCompetitionVN } from "@/settings/enums";

export const columns: ColumnDef<Competitions>[] = [
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
    enableColumnFilter: false,
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
    accessorKey: "startDate",
    header: "Băt đầu",
    cell: ({ row }) => {
      const startDate = formatDate(row.original.startDate, "DD/MM/yyyy");

      return (
        <div className="space-y-2">
          <p>{startDate}</p>
        </div>
      );
    },
    meta: {
      filterVariant: "dateRange",
    },
    filterFn: filterDateRange,
  },
  {
    accessorKey: "endDate",
    header: "kết thúc",
    cell: ({ row }) => {
      const endDate = formatDate(row.original.endDate, "DD/MM/yyyy");

      return (
        <div className="space-y-2">
          <p>{endDate}</p>
        </div>
      );
    },
    meta: {
      filterVariant: "dateRange",
    },
    filterFn: filterDateRange,
  },
  // {
  //   accessorKey: "create_by",
  //   header: "Người tạo",
  //   meta: {
  //     filterVariant: "search",
  //   },
  // },
  {
    accessorKey: "number_join",
    header: "Tổng người tham gia",
    cell: ({ row }) => {
      const numberJoin = row.getValue("number_join") as number;

      return (
        <div className="flex items-center justify-center">
          <span>
            <p>{numberJoin} học sinh</p>
          </span>
        </div>
      );
    },
    meta: {
      filterVariant: "numberRange",
    },
  },
];

const getStatus = (row: Row<Competitions>) => {
  const status = {
    value: row.original.status as keyof typeof StatusCompetitionVN,
    label: row.original.status as keyof typeof StatusCompetitionVN,
  };

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
        <div className="flex items-center text-blue-500">
          <CrossCircledIcon className="mr-2 h-4 w-4 text-blue-500" />
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
    case StatusCompetition.UnActive:
      return (
        <div className="flex items-center text-red-500">
          <Ban className="mr-2 h-4 w-4 text-red-500" />
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
