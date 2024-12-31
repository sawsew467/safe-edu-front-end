"use client";
import React from "react";

import { useGetAllNewsQuery } from "../api";
import { TypeNews } from "../news.type";

import DataTable from "@/components/data-table/data-table";
import { useGetAllTopicQuery } from "@/features/topic/api";
import { DataTopic } from "@/features/topic/topic.type";
import { columns } from "@/app/(dashboard)/tin-tuc/columns";

const NewsTableModule = () => {
  const { librarys, isFetching } = useGetAllNewsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      selectFromResult: ({ data, isFetching }) => {
        return {
          librarys:
            data?.items?.filter((item: TypeNews) => item.isActive) ?? [],
          isFetching,
        };
      },
    },
  );

  const { data: topics } = useGetAllTopicQuery({});

  const data = librarys?.map((news: TypeNews) => ({
    ...news,
    topic_name: topics?.data?.find(
      (topic: DataTopic) => topic._id === news.topic_id,
    )?.topic_name,
  }));

  return <DataTable columns={columns} data={data} isLoading={isFetching} />;
};

export default NewsTableModule;
