"use client";
import React from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { useGetAllStudentsQuery } from "../../api/student.api";
import { Student } from "../../user.types";

import { columns } from "@/app/quan-tri/(dashboard)/nguoi-dung/hoc-sinh/student.columns";
import DataTable from "@/components/data-table/data-table";
import TitlePage from "@/components/ui/title-page";
import { exportStudentsToExcel } from "@/utils/export-excel";
import { Button } from "@/components/ui/button";

const StudentManagement = () => {
  const { students, isFetching } = useGetAllStudentsQuery(
    {},
    {
      selectFromResult: ({ data, isFetching }) => ({
        students:
          data?.data?.items?.map((item: Student) => ({
            ...item,
            full_name: `${item?.first_name} ${item?.last_name}`,
          })) ?? [],
        isFetching,
      }),
    },
  );

  const handleExportExcel = async () => {
    if (students.length === 0) {
      toast.error("Không có dữ liệu để xuất");

      return;
    }

    try {
      await exportStudentsToExcel(students);
      toast.success("Xuất file Excel thành công");
    } catch (error) {
      toast.error("Xuất file Excel thất bại");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 gap-2">
        <TitlePage href="nguoi-dung/hoc-sinh/them" title="Quản lí học sinh" />
        <Button
          className="h-8 px-2 lg:px-3"
          variant="outline"
          onClick={handleExportExcel}
        >
          <Download className="w-4 h-4 mr-2" />
          Xuất Excel
        </Button>
      </div>
      <DataTable columns={columns} data={students} isLoading={isFetching} />
    </>
  );
};

export default StudentManagement;
