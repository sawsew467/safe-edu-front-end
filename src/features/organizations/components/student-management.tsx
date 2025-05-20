"use client";
import React from "react";

import { columns } from "@/app/quan-tri/(dashboard)/nguoi-dung/hoc-sinh/student.columns";
import DataTable from "@/components/data-table/data-table";
import TitlePage from "@/components/ui/title-page";
import { useGetAllStudentsQuery } from "@/features/users/api/student.api";
import { Student } from "@/features/users/user.types";
import { useAppSelector } from "@/hooks/redux-toolkit";

const StudentManagement = () => {
  const { current_organization } = useAppSelector((state) => state.auth);

  const { students, isFetching } = useGetAllStudentsQuery(
    {},
    {
      selectFromResult: ({ data, isFetching }) => {
        return {
          students:
            data?.data?.items
              ?.filter(
                (item: Student) =>
                  String(item?.organizationId?._id) === current_organization?.id
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
