"use client";
import React from "react";
import { useRouter } from "next-nprogress-bar";

import { Competitions } from "../type.competitions";
import { useGetAllCompetitionsQuery } from "../api.competitions";

import CardList from "@/components/ui/data-card";
import { columns } from "@/app/quan-tri/cuoc-thi/columns.competitions";
import { StatusCompetition } from "@/settings/enums";
import TitlePage from "@/components/ui/title-page";

const CompetitionsModule = () => {
  const [isopen, setOpenDialog] = React.useState(false);
  const router = useRouter();
  const { competitions, isFetching } = useGetAllCompetitionsQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => ({
      competitions:
        data?.data?.items?.map((item: Competitions) => ({
          ...item,
          status:
            StatusCompetition[item?.status as keyof typeof StatusCompetition],
        })) ?? [],
      isFetching,
    }),
  });
  const handleRowClick = ({ data }: { data: Competitions }) => {
    router.push(`/quan-tri/cuoc-thi/${data._id}`);
  };

  return (
    <>
      <TitlePage
        contentHref="Thêm cuộc thi mới"
        href="/quan-tri/cuoc-thi/them-cuoc-thi"
        title="Quản lí cuộc thi"
      />
      <CardList
        columns={columns}
        data={competitions}
        isLoading={isFetching}
        onRowClick={handleRowClick}
      />
    </>
  );
};

export default CompetitionsModule;
