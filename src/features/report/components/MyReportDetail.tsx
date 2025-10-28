"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  AlertCircle,
  Clock,
  FileText,
  Shield,
  School,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { getAlertInfo } from "../lib/alert-logic";
import {
  translateViolenceType,
  translateInformationSource,
  translateGender,
  translateRelationship,
  translateLocation,
  translateTime,
  translateImpactLevel,
  translateCurrentSituation,
  translateReliability,
} from "../lib/translation-utils";
import { useGetMyReportByIdQuery } from "../report.user.api";

import { AlertIcon } from "./AlertIcon";
import { StatusTimeline } from "./StatusTimeline";
import { EvidenceViewer } from "./EvidenceViewer";
import { AddEvidenceSection } from "./AddEvidenceSection";
import { ReportDetailSkeleton } from "./ReportDetailSkeleton";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface MyReportDetailProps {
  reportId: string;
}

export function MyReportDetail({ reportId }: MyReportDetailProps) {
  const router = useRouter();
  const { data, isFetching, error } = useGetMyReportByIdQuery(reportId, {
    selectFromResult: ({ data, isFetching, error }) => ({
      data: data?.data,
      isFetching,
      error,
    }),
  });

  if (isFetching) {
    return <ReportDetailSkeleton />;
  }

  if (error && !isFetching) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-3 py-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">
              Không thể tải thông tin phản ánh. Vui lòng thử lại sau.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const report = data?.data;
  const alertInfo = getAlertInfo(report?.alertLevel as 1 | 2 | 3 | 4);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
      "Evidence Added": { label: "Đã thêm bằng chứng", variant: "outline" },
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
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -20 }}
      >
        <Button
          className="mb-4"
          variant="ghost"
          onClick={() => router.push("/phan-anh-cua-toi")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">
              Phản ánh #{report?._id?.slice(-6).toUpperCase()}
            </h1>
            <p className="text-muted-foreground mt-1">
              Chi tiết phản ánh bạo lực học đường của bạn
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(report?.status)}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          transition={{ delay: 0.1 }}
        >
          {/* Alert Level */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full ${alertInfo?.color} flex items-center justify-center text-white`}
                >
                  <AlertIcon
                    className="h-6 w-6"
                    iconName={alertInfo?.icon || "CheckCircle"}
                  />
                </div>
                <div>
                  <CardTitle>Mức độ cảnh báo: {alertInfo?.name}</CardTitle>
                  <CardDescription>{alertInfo?.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Organization Information */}
          {typeof report?.organizationId === "object" &&
            report?.organizationId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5" />
                    Thông tin trường
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="text-sm text-muted-foreground">Tên trường</p>
                    <p className="font-medium text-lg">
                      {report.organizationId.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Victim Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin nạn nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {report?.victimName && (
                <div>
                  <p className="text-sm text-muted-foreground">Tên nạn nhân</p>
                  <p className="font-medium">{report?.victimName}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Lớp / Khối</p>
                <p className="font-medium">{report?.classGrade}</p>
              </div>
              {report?.gender && (
                <div>
                  <p className="text-sm text-muted-foreground">Giới tính</p>
                  <p className="font-medium">
                    {translateGender(report?.gender)}
                  </p>
                </div>
              )}
              {report?.relationshipToVictim && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Mối quan hệ với nạn nhân
                  </p>
                  <p className="font-medium">
                    {translateRelationship(report?.relationshipToVictim)}
                    {report?.relationshipOther &&
                      `: ${report?.relationshipOther}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Incident Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Thông tin vụ việc
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {report?.violenceTypes && report?.violenceTypes?.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Hình thức bạo lực
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {report?.violenceTypes?.length > 3
                      ? report?.violenceTypes
                          ?.slice(0, 3)
                          ?.map((type: string, i: number) => (
                            <Badge key={i} variant="outline">
                              {translateViolenceType(type)}
                            </Badge>
                          ))
                      : report?.violenceTypes?.map(
                          (type: string, i: number) => (
                            <Badge key={i} variant="outline">
                              {translateViolenceType(type)}
                            </Badge>
                          ),
                        )}
                  </div>
                  {report?.violenceOther && (
                    <p className="text-sm font-normal mt-2 ml-2">
                      {report?.violenceOther}
                    </p>
                  )}
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Địa điểm
                  </p>
                  <p className="font-medium">
                    {report?.location
                      ? translateLocation(report?.location)
                      : ""}
                    {report?.locationOther && `: ${report?.locationOther}`}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Thời gian xảy ra
                  </p>
                  <p className="font-medium">
                    {report?.timeOfIncident
                      ? translateTime(report?.timeOfIncident)
                      : "Không rõ"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Mức độ ảnh hưởng
                  </p>
                  <p className="font-medium">
                    {report?.impactLevel
                      ? translateImpactLevel(report?.impactLevel)
                      : "Không rõ"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Tình trạng hiện tại
                  </p>
                  <p className="font-medium">
                    {report?.currentSituation
                      ? translateCurrentSituation(report?.currentSituation)
                      : "Không rõ"}
                  </p>
                </div>
              </div>

              {report?.informationSources &&
                report?.informationSources?.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Nguồn thông tin
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {report?.informationSources?.map(
                          (source: string, i: number) => (
                            <Badge key={i} variant="secondary">
                              {translateInformationSource(source)}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  </>
                )}

              {report?.informationReliability && (
                <div>
                  <p className="text-sm text-muted-foreground">Độ tin cậy</p>
                  <p className="font-medium">
                    {translateReliability(report?.informationReliability)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evidence */}
          {report?.hasEvidence && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Bằng chứng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EvidenceViewer evidenceUrl={report?.evidenceUrl} />
              </CardContent>
            </Card>
          )}

          {/* Add Evidence Section - Only for Pending reports */}
          <AddEvidenceSection
            currentStatus={report?.status}
            reportId={reportId}
          />

          {/* Contact Information */}
          {report?.contactOption && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {report?.contactInfo
                    ? `Liên hệ qua: ${report?.contactInfo}`
                    : report?.externalContactInfo
                      ? `Email/Mã người dùng: ${report?.externalContactInfo}`
                      : "Bạn đã chọn muốn được liên hệ bí mật"}
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          transition={{ delay: 0.2 }}
        >
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Thời gian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Ngày tạo</p>
                <p className="font-medium">{formatDate(report?.created_at)}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">
                  Cập nhật lần cuối
                </p>
                <p className="font-medium">{formatDate(report?.updated_at)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status History */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử xử lý</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline
                createdAt={report?.created_at}
                currentStatus={report?.status}
                timeline={report?.statusTimeline || []}
              />
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Bảo mật thông tin</p>
                  <p className="text-muted-foreground">
                    Tất cả thông tin được mã hóa và bảo vệ theo chính sách bảo
                    mật của SafeEdu. Danh tính của bạn được giữ bí mật tuyệt
                    đối.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
