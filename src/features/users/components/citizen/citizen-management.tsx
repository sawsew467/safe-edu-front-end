"use client";
import React from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { Citizens } from "../../user.types";
import { useGetAllCitizensQuery } from "../../api/citizen.api";

import { columns } from "@/app/quan-tri/(dashboard)/nguoi-dung/cong-dan/citizen.columns";
import DataTable from "@/components/data-table/data-table";
import TitlePage from "@/components/ui/title-page";
import { exportCitizensToExcel } from "@/utils/export-excel";
import { Button } from "@/components/ui/button";

const CitizenManagement = () => {
  const { citizens, isFetching } = useGetAllCitizensQuery(
    {
      pageNumber: 1,
      pageSize: 999,
    },
    {
      selectFromResult: ({ data, isFetching }) => ({
        citizens:
          data?.data?.items?.map((item: Citizens) => ({
            ...item,
            full_name: `${item?.first_name} ${item?.last_name}`,
          })) ?? [],
        isFetching,
      }),
    },
  );

  const handleExportExcel = async () => {
    if (citizens.length === 0) {
      toast.error("Không có dữ liệu để xuất");

      return;
    }

    try {
      await exportCitizensToExcel(citizens);
      toast.success("Xuất file Excel thành công");
    } catch (error) {
      toast.error("Xuất file Excel thất bại");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 gap-2">
        <TitlePage href="nguoi-dung/cong-dan/them" title="Quản lí công dân" />
        <Button
          className="h-8 px-2 lg:px-3"
          variant="outline"
          onClick={handleExportExcel}
        >
          <Download className="w-4 h-4 mr-2" />
          Xuất Excel
        </Button>
      </div>
      <DataTable columns={columns} data={citizens} isLoading={isFetching} />
    </>
  );
};

export default CitizenManagement;
