import React, { useCallback, useState } from "react";
import { Download, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

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
import { useImportQuestionByZipMutation } from "@/services/common/upload/api.upload";
import { useAppDispatch } from "@/hooks/redux-toolkit";
import { baseApiAdmin } from "@/redux/admin/baseApi";
function ImportFileModal() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get("id");

  const [file, setFile] = useState<File | null>(null);
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

  const [importQuestionByZip, { isLoading }] = useImportQuestionByZipMutation();

  const dispatch = useAppDispatch();

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("quizId", quizId ?? "");
    try {
      await importQuestionByZip(formData).unwrap();
      dispatch(baseApiAdmin.util.invalidateTags(["Question"]));
      toast.success("Import dữ liệu thành công");
      setOpenDialog(false);
    } catch (error) {
      toast.error("Import dữ liệu thất bại");
    }
  };

  const handleImport = () => {
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch(
        "https://firebasestorage.googleapis.com/v0/b/next-exam-fpt.appspot.com/o/template%2Fquizz_template.zip?alt=media&token=9a0deebf-e224-43ea-9e39-6d36644583ce"
      );
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `quizz_template.zip`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Không thể tải mẫu. Vui lòng thử lại sau.");
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Import câu hỏi
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <h3 className="text-xl font-500">Nhập dữ liệu từ file zip</h3>
            <p className="text-stone-600 text-sm mt-1">
              Hãy đảm bảo dữ liệu đúng với định dạng của .zip
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
                src="/images/app/zip.png"
                width={120}
              />
              <p className="text-sm text-[#78cc26] mt-2 w-full text-nowrap truncate text-center">
                Tải lên thành công!
              </p>
              <p className="font-medium mt-2 w-full text-nowrap truncate text-center">
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
        </DialogDescription>
        <DialogFooter>
          <div className="w-full justify-between items-center flex">
            <button
              className="hover:underline flex gap-2 items-center hover:text-blue-500 transition-all"
              onClick={handleDownloadTemplate}
            >
              <Download size={14} /> Tải mẫu
            </button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Hủy bỏ</Button>
              </DialogClose>
              <Button
                disabled={!file}
                isLoading={isLoading}
                variant="default"
                onClick={handleImport}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ImportFileModal;
