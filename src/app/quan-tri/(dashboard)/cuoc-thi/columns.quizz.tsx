import { ColumnDef, Row } from "@tanstack/react-table";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Quizz } from "@/features/competitions/type.competitions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDeleteQuizzMutation } from "@/features/competitions/api.admin.quizz";

export const columns: ColumnDef<Quizz>[] = [
  {
    accessorKey: "title",
    header: "Tiêu đề",
    cell: ({ row }) => (
      <p className="w-full text-lg">{row.getValue("title")}</p>
    ),
    meta: {
      filterVariant: "search",
    },
  },
  {
    accessorKey: "type",
    header: "Thể loại",
    cell: ({ row }) => {
      const type = row.getValue("type");

      return type ? (
        <Badge className="flex justify-start mb-2 text-sm">{`${type}`}</Badge>
      ) : (
        <p className="flex justify-start mb-2 text-sm">Không có</p>
      );
    },
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
    id: "actions",
    cell: ({ row }) => Action(row),
  },
];

const getStatus = (row: Row<Quizz>) => {
  const status = row.original.status;

  return status ? (
    <div className="flex items-center text-green-500">
      <CheckCircledIcon className="mr-2 h-4 w-4 text-green-500" />
      <p className="text-sm">{status}</p>
    </div>
  ) : (
    <div className="flex items-center text-red-500">
      <CrossCircledIcon className="mr-2 h-4 w-4 text-red-500" />
      <p className="text-sm">{status}</p>
    </div>
  );
};

const Action = (row: Row<Quizz>) => {
  const [deleteQuizz] = useDeleteQuizzMutation();
  const { id: competitionId } = useParams();
  const handleDeleteQuizz = async (id: string) => {
    const toastID = toast.loading("đang xóa phần thi...");

    try {
      await deleteQuizz({ id }).unwrap();

      toast.success("Xóa phần thi thành công", { id: toastID });
    } catch (err) {
      toast.error("Xóa phần thi thất bại", { id: toastID });
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
            href={`/quan-tri/cuoc-thi/${competitionId}?tab=phan-thi&id=${row.original._id}&action=update`}
          >
            <Pencil className="h-4 w-4 text-green-500" />
            {<span className="">{"Thay đổi"}</span>}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            className="cursor-pointer flex gap-2 px-2 py-1 justify-start w-full"
            onClick={() => handleDeleteQuizz(row.original._id)}
          >
            <Trash className="h-4 w-4 text-red-500" />
            {<span className="">{"Xóa"}</span>}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
