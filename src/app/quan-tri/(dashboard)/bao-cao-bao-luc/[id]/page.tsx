"use client";

import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Edit,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useGetReportByIdQuery } from "@/features/report/report.admin.api";
import {
  ReportDetail,
  UpdateStatusModal,
  ReportDetailSkeleton,
} from "@/features/report";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppSelector } from "@/hooks/redux-toolkit";

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;
  const { current_organization } = useAppSelector((state) => state.auth);

  const isAdmin = current_organization === null;
  const isManager = current_organization !== null;

  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const {
    data: report,
    isLoading: isLoadingReport,
    error,
  } = useGetReportByIdQuery(reportId, {
    selectFromResult: ({ data, ...rest }) => ({
      data: data?.data?.data,
      ...rest,
    }),
  });

  const canUpdateStatus = () => {
    if (!report) return false;

    if (isAdmin) return true;

    if (isManager && report?.alertLevel !== 4) return true;

    return false;
  };

  if (isLoadingReport) {
    return (
      <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
        <ReportDetailSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>
            Không thể tải thông tin báo cáo. Vui lòng thử lại sau.
          </AlertDescription>
        </Alert>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  // Not found state
  if (error && !isLoadingReport) {
    return (
      <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Không tìm thấy</AlertTitle>
          <AlertDescription>
            Báo cáo không tồn tại hoặc đã bị xóa.
          </AlertDescription>
        </Alert>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  // Unauthorized state
  if (!isAdmin && !isManager) {
    return (
      <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Không có quyền truy cập</AlertTitle>
          <AlertDescription>
            Bạn không có quyền xem báo cáo này.
          </AlertDescription>
        </Alert>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <ReportDetail report={report} />

      <div className="mt-6 flex gap-4 items-center">
        {canUpdateStatus() ? (
          // User can update - show enabled button
          <Button onClick={() => setShowUpdateModal(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Cập nhật trạng thái
          </Button>
        ) : isManager && report?.alertLevel === 4 ? (
          // Manager viewing Level 4 - show disabled button with tooltip
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button disabled className="gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    Không thể cập nhật
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chỉ Admin mới có thể cập nhật báo cáo Level 4 (Khẩn cấp)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}

        {/* Status indicator */}
        {report?.status === "Resolved" && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Đã giải quyết</span>
          </div>
        )}
      </div>

      {/* Level 4 Warning for Managers */}
      {isManager && report?.alertLevel === 4 && (
        <Alert className="mt-4 border-orange-200 bg-orange-50">
          <ShieldAlert className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">
            Báo cáo cấp độ khẩn cấp (Level 4)
          </AlertTitle>
          <AlertDescription className="text-orange-700">
            Báo cáo này chỉ có thể được cập nhật bởi quản trị viên hệ thống. Vui
            lòng liên hệ admin nếu cần thay đổi trạng thái.
          </AlertDescription>
        </Alert>
      )}

      {/* Update Status Modal */}
      {showUpdateModal && (
        <UpdateStatusModal
          currentStatus={report?.status}
          open={showUpdateModal}
          reportId={reportId}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={() => {
            toast.success("Cập nhật trạng thái thành công");
            setShowUpdateModal(false);
          }}
        />
      )}
    </div>
  );
}
