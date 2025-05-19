"use client";
import React from "react";
import { useRouter } from "next-nprogress-bar";

import { Competitions } from "../type.competitions";
import { useGetAllCompetitionsQuery } from "../api.competitions";

import CardList from "@/components/ui/data-card";
import { columns } from "@/app/quan-tri/(dashboard)/cuoc-thi/columns.competitions";
import { StatusCompetition } from "@/settings/enums";
import TitlePage from "@/components/ui/title-page";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { useAppSelector } from "@/hooks/redux-toolkit";

const sortByStatus = (a: Competitions, b: Competitions) => {
  if (
    a.status === StatusCompetition.Ongoing &&
    b.status !== StatusCompetition.Ongoing
  )
    return -1;
  if (
    a.status !== StatusCompetition.Ongoing &&
    b.status === StatusCompetition.Ongoing
  )
    return 1;
  if (
    a.status === StatusCompetition.Upcoming &&
    b.status !== StatusCompetition.Upcoming
  )
    return -1;
  if (
    a.status !== StatusCompetition.Upcoming &&
    b.status === StatusCompetition.Upcoming
  )
    return 1;
};

const CompetitionsModule = () => {
  useBreadcrumb([
    {
      label: `Quản lý cuộc thi`,
    },
  ]);

  const { current_organization } = useAppSelector((state) => state.auth);

  const router = useRouter();
  const { competitions, isFetching } = useGetAllCompetitionsQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => {
      const now = new Date();

      return {
        competitions:
          data?.data
            ?.filter(
              (item: Competitions) =>
                item.organizationId === current_organization?.id
            )
            ?.map((item: Competitions) => ({
              ...item,
              status: !item?.isActive
                ? StatusCompetition.UnActive
                : new Date(item?.startDate) > now
                  ? StatusCompetition.Upcoming
                  : new Date(item?.endDate) < now
                    ? StatusCompetition.Outgoing
                    : StatusCompetition.Ongoing,
            }))
            ?.sort(sortByStatus) ?? [],
        isFetching,
      };
    },
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
