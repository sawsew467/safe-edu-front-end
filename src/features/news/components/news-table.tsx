"use client";
import React from "react";

import { useGetAllNewsQuery } from "../api";
import { TypeNews } from "../news.type";

import DataTable from "@/components/data-table/data-table";
import { useGetAllTopicQuery } from "@/features/topic/api";
import { DataTopic } from "@/features/topic/topic.type";
import { columns } from "@/app/(dashboard)/tin-tuc/columns";

const NewsTableModule = () => {
  const { data: topics, isSuccess } = useGetAllTopicQuery({});
  const { news, isFetching } = useGetAllNewsQuery(
    {},
    {
      skip: !isSuccess,
      refetchOnMountOrArgChange: true,
      selectFromResult: ({ data, isFetching }) => {
        return {
          news:
            data?.items
              ?.filter((item: TypeNews) => item.isActive)
              ?.map((news: TypeNews) => ({
                ...news,
                topic_name: topics?.data?.find(
                  (topic: DataTopic) => topic._id === news.topic_id,
                )?.topic_name,
              })) ?? [],
          isFetching,
        };
      },
    },
  );

  return <DataTable columns={columns} data={news} isLoading={isFetching} />;
};

export default NewsTableModule;
