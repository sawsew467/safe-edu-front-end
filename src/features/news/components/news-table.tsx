"use client";
import React from "react";

import { useGetAllNewsQuery } from "../api";
import { TypeNews } from "../news.type";

import DataTable from "@/components/data-table/data-table";
import { columns } from "@/app/quan-tri/(dashboard)/tin-tuc/columns";
import useBreadcrumb from "@/hooks/useBreadcrumb";

const NewsTableModule = () => {
  const { news, isFetching } = useGetAllNewsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      selectFromResult: ({ data, isFetching }) => {
        return {
          news:
            data?.data?.items?.filter((item: TypeNews) => item.isActive) ?? [],
          isFetching,
        };
      },
    }
  );

  useBreadcrumb([{ label: "Tin tức" }]);

  return <DataTable columns={columns} data={news} isLoading={isFetching} />;
};

export default NewsTableModule;
