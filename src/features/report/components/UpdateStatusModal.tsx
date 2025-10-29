"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUpdateReportStatusMutation } from "../report.admin.api";
import { toast } from "sonner";

interface UpdateStatusModalProps {
  open: boolean;
  reportId: string;
  currentStatus: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const STATUS_OPTIONS = [
  { value: "Pending", label: "Đang chờ xử lý" },
  { value: "In Progress", label: "Đang xử lý" },
  { value: "Resolved", label: "Đã giải quyết" },
  { value: "Rejected", label: "Đã từ chối" },
];

export function UpdateStatusModal({
  open,
  reportId,
  currentStatus,
  onClose,
  onSuccess,
}: UpdateStatusModalProps) {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [updateStatus, { isLoading }] = useUpdateReportStatusMutation();

  const handleSubmit = async () => {
    try {
      await updateStatus({ id: reportId, status: newStatus }).unwrap();
      toast.success("Cập nhật trạng thái thành công");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Cập nhật thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          initial={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
        >
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <DialogTitle className="text-center">Cập nhật trạng thái</DialogTitle>
            <DialogDescription className="text-center">
              Chọn trạng thái mới cho báo cáo này
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Trạng thái hiện tại</Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">
                  {STATUS_OPTIONS.find((s) => s.value === currentStatus)?.label}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Trạng thái mới</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              className="w-full sm:w-auto"
              disabled={isLoading}
              variant="outline"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              className="w-full sm:w-auto"
              disabled={isLoading || newStatus === currentStatus}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
