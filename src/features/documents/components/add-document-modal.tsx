"use client";

import React, { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch } from "@/hooks/redux-toolkit";
import { baseApiAdmin } from "@/redux/admin/baseApi";
import constants from "@/settings/constants";
import { getClientCookie } from "@/lib/jsCookies";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const sendFile = async (file: File, name: string) => {
  const formData = new FormData();

  formData.append("image", file);
  formData.append("document_name", name);

  const accessToken = getClientCookie(constants.ACCESS_TOKEN_ADMIN);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/document-files/upload`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.json();
};

function AddDocumentModal() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        setFile(file);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const dispatch = useAppDispatch();

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      const response = await sendFile(file, name);

      console.log("🚀 ~ handleFileUpload ~ response:", response);
      dispatch(baseApiAdmin.util.invalidateTags(["Documents"]));
      toast.success("Import dữ liệu thành công");
      setOpenDialog(false);
    } catch (error) {
      toast.error("Import dữ liệu thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Tải lên tài liệu
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <h3 className="text-xl font-500">Tải lên tài liệu PDF</h3>
            <p className="text-stone-600 text-sm mt-1">
              Hãy đảm bảo dữ liệu đúng với định dạng của .pdf
            </p>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {!file ? (
            <div
              {...getRootProps()}
              className="w-full pt-5 pb-6 flex justify-center items-center border-[1px] border-dashed border-primary flex-col "
            >
              <input {...getInputProps()} />
              <svg
                fill="#72a318"
                height="64px"
                viewBox="0 0 24 24"
                width="64px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
              </svg>
              <p className="text-xl font-medium mt-2">Kéo thả hoặc chọn</p>
              <p className="text-stone-700 text-sm">để tải lên file dữ liệu</p>
            </div>
          ) : (
            <div className="w-full pt-5 pb-6 px-4 flex justify-center items-center flex-col ">
              <input {...getInputProps()} />
              <img
                alt=""
                className="object-cover"
                height={120}
                src="/images/app/pdf.png"
                width={120}
              />
              <p className="text-sm text-[#78cc26] mt-2 w-full text-nowrap truncate text-center">
                Tải lên thành công!
              </p>
              <p className="font-medium mt-2 w-full text-nowrap truncate text-center max-w-[300px]">
                {file.name}
              </p>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p className="text-sm text-stone-500 mt-4 flex gap-2 items-center hover:underline cursor-pointer transition-all">
                  <Upload size={12} />
                  Bấm vào đây để chọn file khác
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2 mt-4">
            <Label>Tên tài liệu</Label>
            <Input
              placeholder="Nhập tên tài liệu"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Hủy bỏ</Button>
          </DialogClose>
          <Button
            disabled={!file || !name}
            isLoading={isLoading}
            variant="default"
            onClick={handleImport}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddDocumentModal;
