"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useUpdateReportAdditionalDetailsMutation } from "../report.user.api";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface UpdateAdditionalDetailsProps {
  reportId: string;
  currentDetails?: string;
  currentStatus?: string;
}

export function UpdateAdditionalDetails({
  reportId,
  currentDetails = "",
  currentStatus,
}: UpdateAdditionalDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [details, setDetails] = useState(currentDetails);
  const [updateAdditionalDetails, { isLoading }] =
    useUpdateReportAdditionalDetailsMutation();

  // Only show for Pending reports
  if (currentStatus !== "Pending") {
    return null;
  }

  const handleSave = async () => {
    try {
      await updateAdditionalDetails({
        id: reportId,
        additionalDetails: details,
      }).unwrap();

      toast.success("Đã cập nhật mô tả chi tiết thành công!");
      setIsEditing(false);
    } catch {
      toast.error("Không thể cập nhật mô tả. Vui lòng thử lại.");
    }
  };

  const handleCancel = () => {
    setDetails(currentDetails);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Mô tả chi tiết</h3>
            {!isEditing && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {currentDetails ? "Chỉnh sửa" : "Thêm mô tả"}
              </Button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
                exit={{ opacity: 0, height: 0 }}
                initial={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Textarea
                  className="min-h-[120px] resize-none"
                  placeholder="Mô tả chi tiết về vụ việc, hoàn cảnh xảy ra, tác động, và các thông tin bổ sung khác..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    disabled={isLoading}
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                  <Button
                    disabled={isLoading || details.trim() === currentDetails}
                    size="sm"
                    onClick={handleSave}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="viewing"
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {currentDetails ? (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">
                      {currentDetails}
                    </p>
                  </div>
                ) : (
                  <div className="bg-muted/50 p-4 rounded-lg border-2 border-dashed">
                    <p className="text-sm text-muted-foreground text-center">
                      Chưa có mô tả chi tiết. Nhấn &ldquo;Thêm mô tả&rdquo; để
                      bổ sung thông tin.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
