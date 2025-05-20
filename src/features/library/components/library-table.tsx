"use client";
import React from "react";

import { useGetAllLibraryQuery } from "../api";
import { Library } from "../library.type";

import DataTable from "@/components/data-table/data-table";
import { columns } from "@/app/quan-tri/(dashboard)/thu-vien/columns";
import { useGetAllTopicQuery } from "@/features/topic/api";
import { DataTopic } from "@/features/topic/topic.type";
import useBreadcrumb from "@/hooks/useBreadcrumb";

const LibraryTable = () => {
  const { data: topics, isSuccess } = useGetAllTopicQuery({});
  const { librarys, isFetching } = useGetAllLibraryQuery(
    {},
    {
      skip: !isSuccess,
      selectFromResult: ({ data, isFetching }) => {
        return {
          librarys:
            data?.data?.items
              ?.filter((item: Library) => item?.isActive)
              ?.map((item: Library) => ({
                ...item,
                topic_name: topics?.data?.data?.find(
                  (topic: DataTopic) => topic._id === item.topic_id._id
                )?.topic_name,
              })) ?? [],
          isFetching,
        };
      },
      refetchOnMountOrArgChange: true,
    }
  );

  useBreadcrumb([{ label: "Thư viện" }]);

  return <DataTable columns={columns} data={librarys} isLoading={isFetching} />;
};

export default LibraryTable;
