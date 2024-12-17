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
  const { data: librarys, isLoading } = useGetAllLibraryQuery({});
  const { data: topics } = useGetAllTopicQuery({});

  const data = useMemo(() => {
    return librarys?.items?.map((library: Library) => ({
      ...library,
      topic_name: topics?.data?.find(
        (topic: DataTopic) => topic._id === library.topic_id,
      )?.topic_name,
    }));
  }, [topics, librarys]);

  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
};

export default LibraryTable;
