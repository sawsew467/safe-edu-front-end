import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Competitions } from "@/features/competitions/type.competitions";
import { isImageLink } from "@/utils/checkimage";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format-date";
import { useDeleteNewsMutation } from "@/features/news/api";
import { filterDateRange } from "@/utils/table";

export interface ColumnCompetitions
  extends Omit<Competitions, "isActive" | "organizations"> {
  isActive: "Hoạt động" | "Tạm dừng";
  organizations: string;
}

export const columns: ColumnDef<ColumnCompetitions>[] = [
  {
    accessorKey: "image",
    cell: ({ row }) => {
      const image: string | null = isImageLink(row.getValue("image"))
        ? row.getValue("image")
        : row.getValue("image");

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
        <p className="text-red-500">* không tìm thấy ảnh</p>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
    cell: ({ row }) => <p>{row.getValue("title")}</p>,
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
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status =
        row.getValue("isActive") === "Hoạt động"
          ? { value: "active", label: "Hoạt động" }
          : { value: "inactive", label: "Tạm dừng" };

      return (
        <div
          className={cn("flex w-[100px] items-center", {
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
        row.original.update_at ?? row.getValue("create_at"),
      );

      return <p>{createDate}</p>;
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

const Action = (row: Row<ColumnCompetitions>) => {
  const [deleteNews] = useDeleteNewsMutation();
  const handleDeleteNews = async (id: string) => {
    const toastID = toast.loading("đang xóa bài báo...");

    try {
      await deleteNews({ id }).unwrap();

      toast.success("Xóa bài báo thành công", { id: toastID });
    } catch (err) {
      toast.error("Xóa bài báo thất bại", { id: toastID });
    }
  };

  return (
    <div className="flex gap-4 mt-2">
      <Link
        className="flex gap-2 w-full"
        href={`tin-tuc/${row.original._id}/chinh-sua`}
      >
        <Pencil className="h-4 w-4 text-green-500" />
      </Link>

      <button
        className="flex gap-2 w-full"
        onClick={() => handleDeleteNews(row.original._id)}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>
    </div>
  );
};
