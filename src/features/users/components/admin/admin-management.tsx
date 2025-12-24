"use client";
import React from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { useGetAllAdminQuery } from "../../api/admin.api";
import ImportAdminModal from "./import-admin-modal";

import { columns } from "@/app/quan-tri/(dashboard)/nguoi-dung/quan-tri-vien/admin.columns";
import DataTable from "@/components/data-table/data-table";
import TitlePage from "@/components/ui/title-page";
import { exportAdminsToExcel } from "@/utils/export-excel";
import { Button } from "@/components/ui/button";

const AdminManagement = () => {
  const { adminData, isFetching } = useGetAllAdminQuery(
    {},
    {
      selectFromResult: ({ data, isFetching }) => ({
        adminData: data?.data?.items ?? [],
        isFetching,
      }),
    },
  );

  const handleExportExcel = async () => {
    if (adminData.length === 0) {
      toast.error("Không có dữ liệu để xuất");

      return;
    }

    try {
      await exportAdminsToExcel(adminData);
      toast.success("Xuất file Excel thành công");
    } catch (error) {
      toast.error("Xuất file Excel thất bại");
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4 gap-2">
        <TitlePage
          contentHref="Thêm Quản trị viên"
          href="nguoi-dung/quan-tri-vien/them"
          title="Quản lí Quản trị viên"
        />
        <div className="flex gap-2">
          <ImportAdminModal />
          <Button
            className="h-8 px-2 lg:px-3"
            variant="outline"
            onClick={handleExportExcel}
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={adminData} isLoading={isFetching} />
    </>
  );
};

export default AdminManagement;
