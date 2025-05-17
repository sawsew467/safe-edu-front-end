"use client";
import React from "react";
import { useRouter } from "next-nprogress-bar";
import { CloudUpload } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Resource } from "./type";

import DataCard from "@/components/ui/data-card";
import { columns } from "@/app/quan-tri/(dashboard)/tai-nguyen/resource.column";
import TitlePage from "@/components/ui/title-page";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const data: Resource[] = [
  {
    _id: "1",
    name: "Resource 1",
    description: "Description 1",
    type: "Type 1",
  },
  {
    _id: "2",
    name: "Resource 2",
    description: "Description 2",
    type: "Type 2",
  },
];

const ResourceModule = () => {
  const router = useRouter();
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClickDetail = ({ data }: { data: Resource }) => {
    router.push(`/quan-tri/tai-nguyen/${data._id}`);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length === 1) {
      const droppedFile = e.dataTransfer.files[0];

      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(droppedFile);
        fileInputRef.current.files = dataTransfer.files;

        const changeEvent = new Event("change", { bubbles: true });

        fileInputRef.current.dispatchEvent(changeEvent);
      }
    } else {
      toast.error("Không thể thêm được nhìu tệp cùng một lúc!");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    if (files.length !== 1) {
      toast.error("Không thể thêm được nhìu tệp cùng một lúc!");
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error("Chỉ được nộp tệp PDF và Word!");

        return;
      }
    }

    console.log("files", files);
  };

  const handleUploadFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="h-full relative"
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        multiple
        accept=".pdf, .doc, .docx"
        className="hidden"
        type="file"
        onChange={handleFileChange}
      />
      <div
        className={cn(
          "absolute -inset-3 z-10 pointer-events-none bg-[#75A815]/10 border-2 justify-center border-[#75A815] rounded-xl",
          isDragging ? "flex" : "hidden",
        )}
      >
        <motion.div
          className="absolute flex gap-2 bottom-4 px-4 py-2 bg-[#75A815] text-white rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <CloudUpload />
          <p>Thả tệp để tải tệp lên</p>
        </motion.div>
      </div>
      <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
        <div className="flex justify-between w-full">
          <TitlePage title="Quản lí tài nguyên" />
          <Button onClick={handleUploadFile}>Tải tài nguyên lên</Button>
        </div>
        <div>
          <DataCard
            columns={columns}
            data={data}
            onRowClick={handleClickDetail}
          />
        </div>
      </div>
    </div>
  );
};

export default ResourceModule;
