"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { AlertInfo } from "../lib/alert-logic";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  open: boolean;
  reportId: string;
  alertInfo: AlertInfo;
  onClose: () => void;
}

export function SuccessModal({
  open,
  reportId,
  alertInfo,
  onClose,
}: SuccessModalProps) {
  const router = useRouter();

  const handleViewReport = () => {
    router.push(`/phan-anh-cua-toi/${reportId}`);
    onClose();
  };

  const handleViewAllReports = () => {
    router.push("/phan-anh-cua-toi");
    onClose();
  };

  const isEmergency = alertInfo.level === 4;

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
              <motion.div
                animate={{ scale: 1 }}
                className={`w-16 h-16 rounded-full flex items-center justify-center ${alertInfo.color}`}
                initial={{ scale: 0 }}
                transition={{ type: "spring", delay: 0.1 }}
              >
                <CheckCircle2 className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            <DialogTitle className="text-center text-xl">
              Báo cáo đã được tiếp nhận
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2 space-y-3">
              <p>
                Báo cáo của bạn đã được tiếp nhận. Cảm ơn bạn đã hành động vì
                một môi trường học đường an toàn. Nhà trường sẽ xem xét và phản
                hồi trong thời gian sớm nhất.
              </p>

              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">
                  Mức cảnh báo: {alertInfo.icon} {alertInfo.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {alertInfo.description}
                </p>
              </div>

              {isEmergency && (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 rounded-lg"
                  initial={{ opacity: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                    Thông tin bạn gửi được xác định ở mức KHẨN CẤP
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Hệ thống SafeEdu sẽ tự động chuyển đến Ban Giám hiệu để xử
                    lý ngay lập tức.
                  </p>
                </motion.div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-6">
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              onClick={handleViewAllReports}
            >
              Xem tất cả báo cáo
            </Button>
            <Button className="w-full sm:w-auto" onClick={handleViewReport}>
              Xem chi tiết báo cáo
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
