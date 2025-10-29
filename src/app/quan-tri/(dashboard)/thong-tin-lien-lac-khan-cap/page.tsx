"use client";

import { AlertCircle } from "lucide-react";

import { EmergencyContactManager } from "@/features/report";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAppSelector } from "@/hooks/redux-toolkit";

export default function EmergencyContactsPage() {
  const { current_organization } = useAppSelector((state) => state.auth);

  const isAdmin = current_organization === null;
  const isManager = current_organization !== null;

  if (isAdmin || isManager) {
    return (
      <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
        <EmergencyContactManager isGlobal={isAdmin} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Không có quyền truy cập</AlertTitle>
        <AlertDescription>
          Bạn không có quyền truy cập trang này. Chỉ quản trị viên và quản lý
          trường mới có thể quản lý thông tin liên lạc khẩn cấp.
        </AlertDescription>
      </Alert>
    </div>
  );
}
