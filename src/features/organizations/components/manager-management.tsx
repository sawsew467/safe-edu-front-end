"use client";
import React from "react";

import { columns } from "@/app/quan-tri/(dashboard)/nguoi-dung/quan-li-vien/manager.columns";
import DataTable from "@/components/data-table/data-table";
import TitlePage from "@/components/ui/title-page";
import { useGetAllManagerQuery } from "@/features/users/api/manager.api";
import { Manager } from "@/features/users/user.types";
import { useAppSelector } from "@/hooks/redux-toolkit";

const ManagerManagement = () => {
  const { current_organization } = useAppSelector((state) => state.auth);

  const { managers, isFetching } = useGetAllManagerQuery(
    {},
    {
      selectFromResult: ({ data, isFetching }) => ({
        managers:
          data?.data?.items
            ?.filter((item: Manager) =>
              item?.organizationId?.some(
                (item) => item?.id === current_organization?.id
              )
            )
            ?.map((item: Manager) => ({
              ...item,
              full_name: `${item?.first_name} ${item?.last_name}`,
            })) ?? [],
        isFetching,
      }),
    }
  );

  console.log("🚀 ~ ManagerManagement ~ managers:", managers);

  return (
    <>
      <TitlePage
        contentHref="Thêm Quản lí viên"
        href="nguoi-dung/quan-li-vien/them"
        title="Quản lí Quản lí viên"
      />
      <DataTable columns={columns} data={managers} isLoading={isFetching} />
    </>
  );
};

export default ManagerManagement;
