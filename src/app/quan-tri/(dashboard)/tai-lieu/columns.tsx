"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { useDeleteDocumentMutation } from "@/features/documents/api";
import { Document } from "@/features/documents/type";

export const columns: ColumnDef<Document>[] = [
  {
    accessorKey: "id",
    header: "Tên",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("id")}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {format(row.getValue("created_at"), "dd/MM/yyyy HH:mm")}
        </div>
      );
    },
  },
  {
    accessorKey: "file_size",
    header: "Kích thước",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("file_size")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => ActionRow({ row }),
  },
];

const ActionRow = ({ row }: { row: Row<Document> }) => {
  console.log("🚀 ~ ActionRow ~ row:", row);
  const [deleteDocument] = useDeleteDocumentMutation();
  const handleDeleteDocument = async (id: string) => {
    try {
      const promise = () =>
        new Promise((resolve) => {
          resolve(deleteDocument(id).unwrap());
        });

      toast.promise(promise, {
        loading: "đang xóa tài liệu...",
        success: "Xóa tài liệu thành công",
        error: "Không thể xóa",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button
      className="flex gap-2 w-full items-center"
      onClick={() => handleDeleteDocument(row.original._id)}
    >
      <Trash2 className="h-4 w-4 text-red-500" />
    </button>
  );
};
