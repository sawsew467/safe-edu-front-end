"use client";
import React from "react";
import { useRouter } from "next-nprogress-bar";

import { Competitions } from "../type.competitions";
import { useGetAllCompetitionsQuery } from "../api.competitions";

import CardList from "@/components/ui/data-card";
import { columns } from "@/app/(dashboard)/cuoc-thi/columns.competitions";
import { StatusCompetition } from "@/settings/enums";
const CompetitionsModule = () => {
  const router = useRouter();
  const { competitions, isFetching } = useGetAllCompetitionsQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      competitions:
        data?.items?.map((item: Competitions) => ({
          ...item,
          status:
            StatusCompetition[item?.status as keyof typeof StatusCompetition],
        })) ?? [],
      isFetching,
    }),
  });
  const handleRowClick = ({ data }: { data: Competitions }) => {
    router.push(`/cuoc-thi/${data._id}`);
  };

  return (
    <CardList
      columns={columns}
      data={competitions}
      isLoading={isFetching}
      onRowClick={handleRowClick}
    />
  );
};

export default CompetitionsModule;
