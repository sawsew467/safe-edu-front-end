"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { HardDriveUpload, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useState } from "react";

import {
  useDeleteDocumentMutation,
  useUpdateDocumentMutation,
} from "@/features/documents/api";
import { Document } from "@/features/documents/type";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Document>[] = [
  {
    accessorKey: "document_name",
    header: "Tên",
    cell: ({ row }) => {
      return (
        <div className="font-medium max-w-[400px]  line-clamp-2">
          <a
            className="text-blue-500 hover:underline"
            href={`${row.original.file_url}`}
            rel="noreferrer"
            target="_blank"
          >
            {row.getValue("document_name")}
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "isUploaded",
    header: "Chatbot",
    cell: ({ row }) => {
      return (
        <Badge
          className={`transition-all  ${
            row.getValue("isUploaded")
              ? "bg-green-500 hover:bg-green-400 text-white"
              : "bg-red-500 hover:bg-red-400 text-white"
          }`}
        >
          {row.getValue("isUploaded") ? "Đã nạp" : "Chưa nạp"}
        </Badge>
      );
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
      return (
        <div className="font-medium">
          {Number(row.getValue("file_size"))?.toFixed(2)} KB
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => ActionRow({ row }),
  },
];

const ActionRow = ({ row }: { row: Row<Document> }) => {
  const [deleteDocument] = useDeleteDocumentMutation();
  const [updateDocument] = useUpdateDocumentMutation();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const handleDeleteDocument = async (file: Document) => {
    try {
      setIsDeleting(true);
      await fetch("/api/ai-knowledge", {
        method: "DELETE",
        body: JSON.stringify({ id: file._id }),
      });
      await deleteDocument(file._id).unwrap();

      toast.success("Xóa tài liệu thành công");
    } catch (err) {
      toast.error("Không thể xóa");
      console.log(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUploadDocument = async (file: Document) => {
    try {
      setIsUploading(true);
      await fetch("/api/ai-knowledge", {
        method: "POST",
        body: JSON.stringify({ file: file }),
      });

      await updateDocument({
        id: file._id,
        isUploaded: true,
      });

      toast.success("Tải tài liệu thành công");
    } catch (err) {
      toast.error("Tải tài liệu thất bại");
      console.log(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        className="flex gap-2 w-full items-center"
        onClick={() => handleUploadDocument(row.original)}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
        ) : (
          <HardDriveUpload className="h-4 w-4 text-blue-500" />
        )}
      </button>
      <button
        className="flex gap-2 w-full items-center"
        onClick={() => setIsOpenDeleteModal(true)}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>
      <Dialog open={isOpenDeleteModal} onOpenChange={setIsOpenDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold text-red-500">
              Xóa tài liệu
            </DialogTitle>
            <DialogDescription className="text-center w-4/5 mx-auto">
              Bạn có chắc chắn muốn xóa tài liệu này không? Xoá tài liệu cũng sẽ
              xoá dữ liệu đã nạp vào chatbot.
              <br />
              Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpenDeleteModal(false)}
            >
              Hủy
            </Button>
            <Button
              disabled={isDeleting}
              variant="destructive"
              onClick={() => handleDeleteDocument(row.original)}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 text-white animate-spin" />
              ) : (
                "Xóa"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
