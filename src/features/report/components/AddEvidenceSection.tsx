"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { EvidenceFile } from "../report.type";
import { useUpdateReportEvidenceMutation } from "../report.user.api";

import { EvidenceUploader } from "./EvidenceUploader";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AddEvidenceSectionProps {
  reportId: string;
  currentStatus: string;
}

export function AddEvidenceSection({
  reportId,
  currentStatus,
}: AddEvidenceSectionProps) {
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [updateEvidence, { isLoading }] = useUpdateReportEvidenceMutation();

  // Chỉ cho phép thêm evidence khi status là Pending
  if (currentStatus !== "Pending") {
    return null;
  }

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.error("Vui lòng chọn ít nhất một file");

      return;
    }

    try {
      // Lấy URLs từ files đã upload
      const evidenceUrls = files
        .map((f) => f.preview)
        .filter((url): url is string => !!url);

      await updateEvidence({
        id: reportId,
        data: {
          evidenceUrls,
          hasEvidence: true,
        },
      }).unwrap();

      toast.success("Đã thêm bằng chứng thành công");
      setFiles([]); // Clear files sau khi upload thành công
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm bằng chứng");
      console.error("Error updating evidence:", error);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Thêm bằng chứng
        </CardTitle>
        <CardDescription>
          Bạn có thể thêm bằng chứng (hình ảnh, video) cho phản ánh đang chờ xử
          lý
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <EvidenceUploader
          files={files}
          onChange={setFiles}
          onUploadComplete={() => setIsUploading(false)}
          onUploadStart={() => setIsUploading(true)}
        />

        {files.length > 0 && (
          <Button
            className="w-full"
            disabled={isLoading || isUploading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang gửi bằng chứng...
              </>
            ) : isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang tải lên hình ảnh...
              </>
            ) : (
              "Thêm bằng chứng"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
