"use client";

import { AlertCircle } from "lucide-react";

import { AdminReportsList, OrganizationReportsList } from "@/features/report";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAppSelector } from "@/hooks/redux-toolkit";

export default function ReportsManagementPage() {
  const { current_organization } = useAppSelector((state) => state.auth);

  if (current_organization === null) {
    return (
      <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
        <AdminReportsList />
      </div>
    );
  }

  if (current_organization) {
    return (
      <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
        <OrganizationReportsList />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Không có quyền truy cập</AlertTitle>
        <AlertDescription>
          Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên
          nếu bạn nghĩ đây là lỗi.
        </AlertDescription>
      </Alert>
    </div>
  );
}
