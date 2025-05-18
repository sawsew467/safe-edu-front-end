"use client";
import React from "react";
import { useParams } from "next/navigation";

import { columns } from "@/app/quan-tri/(dashboard)/nguoi-dung/hoc-sinh/student.columns";
import DataTable from "@/components/data-table/data-table";
import TitlePage from "@/components/ui/title-page";
import { useGetAllStudentsQuery } from "@/features/users/api/student.api";
import { Student } from "@/features/users/user.types";

const StudentManagement = () => {
  const { id: organizationId } = useParams<{ id: string }>();


  const { students, isFetching } = useGetAllStudentsQuery(
    {},
    {
      selectFromResult: ({ data, isFetching }) => {

        return {
          students:
            data?.data?.items
              ?.filter(
                (item: Student) =>
                  String(item?.organizationId?._id) === organizationId
              )
              ?.map((item: Student) => ({
                ...item,
                full_name: `${item?.first_name} ${item?.last_name}`,
              })) ?? [],
          isFetching,
        };
      },
    }
  );

  console.log("🚀 ~ StudentManagement ~ students:", students);

  return (
    <>
      <TitlePage
        contentHref="Thêm học sinh viên"
        href="nguoi-dung/hoc-sinh/them"
        title="Quản lí học sinh"
      />
      <DataTable columns={columns} data={students} isLoading={isFetching} />
    </>
  );
};

export default StudentManagement;
