"use client";
import React from "react";

import { useGetAllAdminQuery } from "../admin.api";

import { columns } from "@/app/(dashboard)/nguoi-dung/admin.columns";
import DataTable from "@/components/data-table/data-table";
import TitlePage from "@/components/ui/title-page";

const AdminManagement = () => {
  const { adminData, isFetching } = useGetAllAdminQuery(
    {},
    {
      selectFromResult: ({ data, isFetching }) => ({
        adminData: data?.items ?? [],
        isFetching,
      }),
    },
  );

  return (
    <>
      <TitlePage
        contentHref="Thêm Quản lí"
        href="nguoi-dung/them-quan-li"
        title="Quản lí Quản trị viên"
      />
      <DataTable columns={columns} data={adminData} isLoading={isFetching} />
    </>
  );
};

export default AdminManagement;