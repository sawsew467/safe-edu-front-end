import React from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";

interface FileUploadDropzoneProps {
  onDrop: DropzoneOptions["onDrop"];
}

function FileUploadDropzone({ onDrop }: FileUploadDropzoneProps) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="w-full pt-5 pb-6 flex justify-center items-center border-[1px] border-dashed border-primary flex-col cursor-pointer hover:bg-muted/50 transition-colors"
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
      <p className="text-stone-700 text-sm">
        để tải lên file Excel (.xlsx, .xls)
      </p>
    </div>
  );
}

export default FileUploadDropzone;
