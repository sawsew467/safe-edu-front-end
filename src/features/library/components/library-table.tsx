"use client";
import React from "react";

import { useGetAllLibraryQuery } from "../api";
import { Library } from "../library.type";

import DataTable from "@/components/data-table/data-table";
import { columns } from "@/app/(dashboard)/thu-vien/columns";
import { useGetAllTopicQuery } from "@/features/topic/api";
import { DataTopic } from "@/features/topic/topic.type";

const LibraryTable = () => {
  const { librarys, isFetching } = useGetAllLibraryQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      selectFromResult: ({ data, isFetching }) => {
        return {
          librarys: data?.items?.filter((item: Library) => item.isActive) ?? [],
          isFetching,
        };
      },
    },
  );

  const { data: topics } = useGetAllTopicQuery({});

  const data = () => {
    return librarys?.map((library: Library) => ({
      ...library,
      topic_name: topics?.data?.find(
        (topic: DataTopic) => topic._id === library.topic_id,
      )?.topic_name,
    }));
  };
  const newData = data();

  return <DataTable columns={columns} data={newData} isLoading={isFetching} />;
};

export default LibraryTable;
