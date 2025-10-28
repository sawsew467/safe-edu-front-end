"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Filter, Loader2, AlertCircle, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

import { useGetMyReportsQuery } from "../report.user.api";
import { Report } from "../report.type";
import { getAlertInfo } from "../lib/alert-logic";

import { ReportCard } from "./ReportCard";
import { AlertIcon } from "./AlertIcon";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function MyReportsList() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [alertLevel, setAlertLevel] = useState<number | undefined>(undefined);

  const { data, isFetching, error, empty } = useGetMyReportsQuery(
    {
      page,
      limit: 10,
      status,
      alertLevel,
    },
    {
      selectFromResult: ({ data, isFetching, error }) => ({
        data: data?.data,
        isFetching,
        error,
        empty: data?.data?.length === 0 && !isFetching && !error,
      }),
    },
  );

  const handleCreateNew = () => {
    router.push("/phan-anh");
  };

  const handleStatusChange = (value: string) => {
    setStatus(value === "all" ? undefined : value);
    setPage(1);
  };

  const handleAlertLevelChange = (value: string) => {
    setAlertLevel(value === "all" ? undefined : parseInt(value));
    setPage(1);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
      >
        <div>
          <h1 className="text-3xl font-bold">Phản ánh của tôi</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và theo dõi các phản ánh bạo lực học đường của bạn
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo phản ánh mới
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -20 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle>Bộ lọc</CardTitle>
            </div>
            <CardDescription>
              Lọc phản ánh theo trạng thái và mức độ cảnh báo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Trạng thái</p>
                <Select
                  value={status || "all"}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="Pending">Đang chờ xử lý</SelectItem>
                    <SelectItem value="In Progress">Đang xử lý</SelectItem>
                    <SelectItem value="Resolved">Đã giải quyết</SelectItem>
                    <SelectItem value="Rejected">Đã từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Mức độ cảnh báo</p>
                <Select
                  value={alertLevel?.toString() || "all"}
                  onValueChange={handleAlertLevelChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả mức độ</SelectItem>
                    <SelectItem value="1">
                      <div className="flex items-center gap-2">
                        <AlertIcon
                          className="h-3.5 w-3.5"
                          iconName={getAlertInfo(1).icon}
                        />
                        Nhẹ
                      </div>
                    </SelectItem>
                    <SelectItem value="2">
                      <div className="flex items-center gap-2">
                        <AlertIcon
                          className="h-3.5 w-3.5"
                          iconName={getAlertInfo(2).icon}
                        />
                        Trung bình
                      </div>
                    </SelectItem>
                    <SelectItem value="3">
                      <div className="flex items-center gap-2">
                        <AlertIcon
                          className="h-3.5 w-3.5"
                          iconName={getAlertInfo(3).icon}
                        />
                        Nghiêm trọng
                      </div>
                    </SelectItem>
                    <SelectItem value="4">
                      <div className="flex items-center gap-2">
                        <AlertIcon
                          className="h-3.5 w-3.5"
                          iconName={getAlertInfo(4).icon}
                        />
                        Khẩn cấp
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reports List */}
      {isFetching ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-3 py-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">
              Không thể tải danh sách phản ánh. Vui lòng thử lại sau.
            </p>
          </CardContent>
        </Card>
      ) : !empty ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.data?.map((report: Report, index: number) => (
              <ReportCard
                key={report?._id}
                index={index}
                report={report}
                onClick={() => router.push(`/phan-anh-cua-toi/${report?._id}`)}
              />
            ))}
          </div>

          {/* Pagination */}
          {data?.total > 10 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                disabled={page === 1}
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Trang trước
              </Button>
              <div className="flex items-center gap-2 px-4">
                <span className="text-sm text-muted-foreground">
                  Trang {page} / {Math.ceil(data?.total / 10)}
                </span>
              </div>
              <Button
                disabled={page >= Math.ceil(data?.total / 10)}
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
              >
                Trang sau
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <motion.div
              animate={{ scale: 1 }}
              className="flex justify-center"
              initial={{ scale: 0 }}
              transition={{ type: "spring" }}
            >
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </motion.div>
            <div>
              <p className="text-lg font-medium mb-2">Chưa có phản ánh nào</p>
              <p className="text-muted-foreground mb-4">
                Bạn chưa tạo phản ánh nào. Hãy tạo phản ánh đầu tiên của bạn!
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo phản ánh mới
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
