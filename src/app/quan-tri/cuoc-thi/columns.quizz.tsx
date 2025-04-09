import { ColumnDef, Row } from "@tanstack/react-table";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { Eye, Pencil } from "lucide-react";
import { toast } from "sonner";
import React from "react";
import Link from "next/link";

import { Quizz } from "@/features/competitions/type.competitions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import FormEditOrganizations from "@/features/organizations/components/form-edit-new-organizations";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteCompetitionsMutation } from "@/features/competitions/api.competitions";
import { Badge } from "@/components/ui/badge";

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
    accessorKey: "isActive",
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
  const [isopen, setOpenDialog] = React.useState(false);
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
            href={`/cuoc-thi/${row.original._id}`}
          >
            <Eye className="h-4 w-4 text-blue-500" />
            {<span className="">{"Xem"}</span>}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Dialog open={isopen}>
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
