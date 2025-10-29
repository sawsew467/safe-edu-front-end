"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

import { useGetAllReportsQuery } from "../report.admin.api";
import { Report } from "../report.type";
import { VIOLENCE_TYPES } from "../report.data";
import { getAlertInfo } from "../lib/alert-logic";
import { getVietnameseStatus, getStatusConfig } from "../constants/status";

import { AlertIcon } from "./AlertIcon";

import CardList from "@/components/ui/data-card";
import { Badge } from "@/components/ui/badge";
import { filterDateRange } from "@/utils/table";

const getAlertLevelBadge = (level: number) => {
  const alertInfo = getAlertInfo(level as 1 | 2 | 3 | 4);
  const variantMap = {
    1: "outline" as const,
    2: "secondary" as const,
    3: "destructive" as const,
    4: "destructive" as const,
  };
  const variant = variantMap[level as keyof typeof variantMap] || "outline";

  return (
    <Badge variant={variant}>
      <div className="flex items-center gap-1.5">
        <AlertIcon className="h-3.5 w-3.5" iconName={alertInfo?.icon} />
        <span>{alertInfo?.name}</span>
      </div>
    </Badge>
  );
};

const getStatusBadge = (status: string) => {
  const config = getStatusConfig(status);

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getViolenceTypeBadge = (violenceType: string) => {
  const violenceConfig: Record<string, { bg: string; text: string }> = {
    "Physical violence": {
      bg: "bg-red-100 dark:bg-red-950",
      text: "text-red-700 dark:text-red-300",
    },
    "Verbal abuse": {
      bg: "bg-orange-100 dark:bg-orange-950",
      text: "text-orange-700 dark:text-orange-300",
    },
    "Emotional or social isolation": {
      bg: "bg-purple-100 dark:bg-purple-950",
      text: "text-purple-700 dark:text-purple-300",
    },
    Cyberbullying: {
      bg: "bg-blue-100 dark:bg-blue-950",
      text: "text-blue-700 dark:text-blue-300",
    },
    Other: {
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-700 dark:text-gray-300",
    },
  };

  const config = violenceConfig[violenceType] || violenceConfig["Other"];
  const label =
    VIOLENCE_TYPES.find((v) => v.value === violenceType)?.label || violenceType;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {label}
    </span>
  );
};

export function AdminReportsList() {
  const router = useRouter();

  const { data, isLoading } = useGetAllReportsQuery(
    {
      page: 1,
      limit: 1000,
      level: 4,
    },
    {
      selectFromResult: ({ data, ...rest }) => ({
        data: data?.data,
        ...rest,
      }),
    },
  );

  const columns = useMemo<ColumnDef<Report>[]>(
    () => [
      {
        accessorKey: "victimName",
        header: "Nạn nhân",
        cell: ({ row }) => row?.original?.victimName || "Không tiết lộ",
        meta: {
          filterVariant: "search",
        },
      },
      {
        accessorKey: "classGrade",
        header: "Lớp",
        meta: {
          filterVariant: "select",
        },
      },
      {
        accessorKey: "violenceTypes",
        header: "Loại bạo lực",
        cell: ({ row }) => (
          <div className="flex flex-wrap justify-end gap-1">
            {row?.original?.violenceTypes?.map((type, index) => (
              <span key={index}>{getViolenceTypeBadge(type)}</span>
            ))}
          </div>
        ),
        meta: {
          filterVariant: "select",
        },
        filterFn: (row, id, value) => {
          const violenceTypes = row.original.violenceTypes || [];

          return value.some((filterValue: string) =>
            violenceTypes.includes(filterValue),
          );
        },
      },
      {
        accessorKey: "alertLevel",
        header: "Mức độ",
        cell: ({ row }) => getAlertLevelBadge(row?.original?.alertLevel),
        accessorFn: (row) => {
          const alertInfo = getAlertInfo(row.alertLevel as 1 | 2 | 3 | 4);

          return alertInfo?.name || "";
        },
        meta: {
          filterVariant: "select",
        },
        filterFn: (row, id, value) => {
          const alertInfo = getAlertInfo(
            row.original.alertLevel as 1 | 2 | 3 | 4,
          );

          return alertInfo?.name === value;
        },
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => getStatusBadge(row?.original?.status),
        accessorFn: (row) => {
          return getVietnameseStatus(row.status);
        },
        meta: {
          filterVariant: "select",
        },
        filterFn: (row, id, value) => {
          const statusInVietnamese = getVietnameseStatus(row.original.status);

          return statusInVietnamese === value;
        },
      },
      {
        accessorKey: "created_at",
        header: "Ngày tạo",
        cell: ({ row }) =>
          new Date(row?.original?.created_at).toLocaleDateString("vi-VN"),
        meta: {
          filterVariant: "dateRange",
        },
        filterFn: filterDateRange,
      },
    ],
    [],
  );

  return (
    <div className="mx-auto space-y-6">
      {/* Header */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -20 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Quản lý báo cáo</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý tất cả báo cáo bạo lực học đường trong hệ thống
            </p>
          </div>
          <Badge className="text-lg px-4 py-2" variant="outline">
            Tổng: {data?.data?.length || 0}
          </Badge>
        </div>
      </motion.div>

      <CardList
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        onRowClick={({ data: report }) => {
          router.push(`/quan-tri/bao-cao-bao-luc/${report?._id}`);
        }}
      />
    </div>
  );
}
