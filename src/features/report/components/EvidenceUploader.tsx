"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, File, Image as ImageIcon, Video, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { EvidenceFile } from "../report.type";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUploadImageMutation } from "@/services/common/upload/api.upload";

interface EvidenceUploaderProps {
  files: EvidenceFile[];
  onChange: (files: EvidenceFile[]) => void;
  maxSize?: number;
  onUploadStart?: () => void;
  onUploadComplete?: () => void;
}

export function EvidenceUploader({
  files,
  onChange,
  maxSize = 10,
  onUploadStart,
  onUploadComplete,
}: EvidenceUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [upload, { isLoading }] = useUploadImageMutation();

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    onUploadStart?.();

    const newFiles: EvidenceFile[] = [];

    try {
      await Promise.all(
        Array.from(selectedFiles).map(async (file) => {
          if (file.size > maxSize * 1024 * 1024) {
            toast.error(`File ${file.name} exceeds ${maxSize}MB limit`);

            return;
          }

          const id = Math.random().toString(36).substring(7);

          if (file.type.startsWith("image/")) {
            const formData = new FormData();

            formData.append("file", file);

            const res = await upload(formData).unwrap();

            newFiles.push({ id, file, preview: res.data.data });
          }
        }),
      );

      onChange([...files, ...newFiles]);
    } finally {
      onUploadComplete?.();
    }
  };

  const removeFile = (id: string) => {
    const fileToRemove = files.find((f) => f.id === id);

    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    onChange(files.filter((f) => f.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/"))
      return <ImageIcon className="h-5 w-5" />;
    if (file.type.startsWith("video/")) return <Video className="h-5 w-5" />;

    return <File className="h-5 w-5" />;
  };

  return (
    <div className="space-y-3">
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer hover:border-primary/50",
          isDragging && "border-primary bg-primary/5",
          isLoading && "opacity-50 cursor-not-allowed",
        )}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isLoading) setIsDragging(true);
        }}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 px-4 relative">
          {isLoading ? (
            <>
              <Loader2 className="h-10 w-10 text-primary mb-3 animate-spin" />
              <p className="text-sm font-medium mb-1">Đang tải lên...</p>
              <p className="text-xs text-muted-foreground">
                Vui lòng chờ trong giây lát
              </p>
            </>
          ) : (
            <>
              <motion.div
                animate={{ y: isDragging ? -5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Upload className="h-10 w-10 text-muted-foreground mb-3" />
              </motion.div>
              <p className="text-sm font-medium mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                Images and videos up to {maxSize}MB
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        multiple
        accept="image/*,video/*"
        className="hidden"
        type="file"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      <AnimatePresence mode="popLayout">
        {files.length > 0 && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-2"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
          >
            {files.map((evidenceFile, index) => (
              <motion.div
                key={evidenceFile.id}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                initial={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="flex items-center gap-3 p-3">
                    {evidenceFile.preview ? (
                      <motion.img
                        alt={evidenceFile.file.name}
                        className="h-16 w-16 rounded object-cover"
                        src={evidenceFile.preview}
                        whileHover={{ scale: 1.05 }}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                        {getFileIcon(evidenceFile.file)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {evidenceFile.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(evidenceFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                      size="icon"
                      type="button"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(evidenceFile.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
