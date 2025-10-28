"use client";

import {
  CheckCircle2,
  Clock,
  RefreshCw,
  XCircle,
  FilePlus,
  FileImage,
} from "lucide-react";

import { translateStatus } from "../lib/translation-utils";

interface StatusTimelineItem {
  oldStatus?: string | null;
  newStatus: string;
  changedBy?: string;
  note?: string;
  changedAt: string;
}

interface StatusTimelineProps {
  timeline: StatusTimelineItem[];
  currentStatus: string;
  createdAt: string;
}

export function StatusTimeline({
  timeline,
  currentStatus,
  createdAt,
}: StatusTimelineProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Tạo timeline items từ dữ liệu
  const timelineItems: Array<{
    status: string;
    date: string;
    note?: string;
    isFirst?: boolean;
    isLast?: boolean;
  }> = [];

  // Nếu có statusTimeline từ API, dùng nó
  if (timeline && timeline.length > 0) {
    timeline.forEach((item, index) => {
      timelineItems.push({
        status: item.newStatus,
        date: item.changedAt,
        note: item.note,
        isFirst: index === 0,
      });
    });
  } else {
    // Fallback: Nếu không có statusTimeline, tạo item đầu tiên
    timelineItems.push({
      status: "Pending",
      date: createdAt,
      isFirst: true,
    });
  }

  // Đánh dấu item cuối cùng
  if (timelineItems.length > 0) {
    timelineItems[timelineItems.length - 1].isLast = true;
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      Create: "bg-primary",
      Pending: "bg-gray-400",
      "In Progress": "bg-blue-500",
      Resolved: "bg-green-500",
      Rejected: "bg-red-500",
    };

    return colorMap[status] || "bg-amber-500";
  };

  const getStatusIcon = (status: string, isFirst: boolean, isLast: boolean) => {
    const iconClass = isLast ? "h-5 w-5 text-white" : "h-4 w-4 text-white";

    // Icon cho trạng thái tạo mới
    if (isFirst) {
      return <FilePlus className={iconClass} />;
    }

    // Icon theo từng status
    const iconMap: Record<string, JSX.Element> = {
      Pending: <Clock className={iconClass} />,
      "In Progress": <RefreshCw className={iconClass} />,
      Resolved: <CheckCircle2 className={iconClass} />,
      Rejected: <XCircle className={iconClass} />,
    };

    return iconMap[status] || <FileImage className={iconClass} />;
  };

  return (
    <div className="space-y-0">
      {timelineItems.map((item, index) => (
        <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
          {/* Vertical Line */}
          {!item.isLast && (
            <div
              aria-hidden="true"
              className="absolute left-[15px] top-8 h-full w-0.5 bg-border"
            />
          )}

          {/* Icon */}
          <div className="relative flex-shrink-0">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${getStatusColor(
                item.status,
              )}`}
            >
              {getStatusIcon(item.status, !!item.isFirst, !!item.isLast)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 pt-0.5">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">
                {translateStatus(item.status)}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDate(item.date)}
            </p>
            {item.note && (
              <p className="text-xs text-muted-foreground mt-1 italic">
                {item.note}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
