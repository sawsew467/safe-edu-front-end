"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, AlertCircle } from "lucide-react";

import { getAlertInfo } from "../lib/alert-logic";
import {
  translateViolenceType,
  translateLocation,
} from "../lib/translation-utils";
import { Report } from "../report.type";

import { AlertIcon } from "./AlertIcon";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReportCardProps {
  report: Report;
  index: number;
  onClick?: () => void;
}

export function ReportCard({
  report,
  index,
  onClick = () => {},
}: ReportCardProps) {
  const alertInfo = getAlertInfo(report?.alertLevel as 1 | 2 | 3 | 4);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any }> = {
      Pending: { label: "Đang chờ xử lý", variant: "secondary" },
      "In Progress": { label: "Đang xử lý", variant: "default" },
      Resolved: { label: "Đã giải quyết", variant: "success" },
      Rejected: { label: "Đã từ chối", variant: "destructive" },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      variant: "secondary",
    };

    return (
      <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
    );
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
    >
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer h-full"
        onClick={onClick}
      >
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div
                className={`${alertInfo?.color} rounded-full w-10 h-10 flex items-center justify-center text-white`}
              >
                <AlertIcon iconName={alertInfo?.icon || "CheckCircle"} />
              </div>
              <div>
                <CardTitle className="text-lg">
                  Báo cáo #{report?._id?.slice(-6).toUpperCase()}
                </CardTitle>
                <CardDescription className="text-xs">
                  Mức độ: {alertInfo?.name}
                </CardDescription>
              </div>
            </div>
            {getStatusBadge(report?.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formatDate(report?.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {report?.location
                  ? translateLocation(report.location)
                  : "Không rõ"}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">
              Lớp/Khối: {report?.classGrade}
            </p>
            {report?.violenceTypes && report?.violenceTypes?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {report?.violenceTypes?.slice(0, 3).map((type: string) => (
                  <Badge key={type} className="text-xs" variant="outline">
                    {translateViolenceType(type)}
                  </Badge>
                ))}
                {report?.violenceTypes?.length > 3 && (
                  <Badge className="text-xs" variant="outline">
                    +{report?.violenceTypes?.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {report?.hasEvidence && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
              <span>Có bằng chứng đính kèm</span>
            </div>
          )}

          <Button
            className="w-full mt-2"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Xem chi tiết
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
