"use client";
import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { useGetAllLibraryQuery } from "../api";
import { Library } from "../library.type";

import DataTable from "@/components/data-table/data-table";
import { columns } from "@/app/(dashboard)/thu-vien/columns";
import { useGetAllTopicQuery } from "@/features/topic/api";
import { DataTopic } from "@/features/topic/topic.type";

const LibraryTable = () => {
  const params = useSearchParams();
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

  const data = useMemo(() => {
    return librarys?.map((library: Library) => ({
      ...library,
      topic_name: topics?.data?.find(
        (topic: DataTopic) => topic._id === library.topic_id,
      )?.topic_name,
    }));
  }, [topics, librarys]);

  return <DataTable columns={columns} data={data} isLoading={isFetching} />;
};

export default LibraryTable;
