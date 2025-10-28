"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EmergencyModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function EmergencyModal({
  open,
  onConfirm,
  onCancel,
}: EmergencyModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          initial={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
        >
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center"
                initial={{ scale: 1 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <AlertTriangle className="h-8 w-8 text-white" />
              </motion.div>
            </div>
            <DialogTitle className="text-center text-xl">
              Phân loại cảnh báo khẩn cấp
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Thông tin bạn cung cấp đã được phân loại ở mức{" "}
              <span className="font-semibold text-amber-600">KHẨN CẤP</span>.
              <br />
              <br />
              SafeEdu sẽ ngay lập tức thông báo đến Ban Giám hiệu để có hành
              động khẩn cấp. Điều này đảm bảo phản hồi nhanh nhất có thể để bảo
              vệ sự an toàn của học sinh.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-6">
            <Button
              className="w-full sm:w-auto"
              variant="outline"
              onClick={onCancel}
            >
              Quay lại
            </Button>
            <Button
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700"
              onClick={onConfirm}
            >
              Xác nhận gửi
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
