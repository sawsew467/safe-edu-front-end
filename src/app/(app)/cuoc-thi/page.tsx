import React from "react";

import constants from "@/settings/constants";
import { Competitions } from "@/features/competitions/type.competitions";
import { CompetitionArticleCard } from "@/features/competitions/components/competition-artile-card";
import { formatDate } from "@/utils/format-date";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { customFetch } from "@/utils/custom-fetch";

export const metadata = {
  title: "Cuộc thi mới nhất",
  description:
    "Cập nhật những cuộc thi mới nhất và nổi bật trong lĩnh vực giáo dục từ SafeEdu.",
  openGraph: {
    title: "Cuộc thi mới nhất",
    description:
      "Cập nhật những cuộc thi mới nhất và nổi bật trong lĩnh vực giáo dục từ SafeEdu.",
    url: "https://www.safe-edu.site/cuoc-thi",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 800,
        height: 600,
        alt: "SafeEdu Competitions",
      },
    ],
  },
};

const fetchLatestCompetitions = async (
  page: number,
): Promise<{
  totalPage: number;
  latestCompetitions: Competitions[];
}> => {
  const res = await customFetch(
    `${constants.API_SERVER}/competitions?pageNumber=${page}&pageSize=10`,
  );
  const { data } = await res.json();

  const latestCompetitions =
    data?.items?.filter(
      (item: Competitions) =>
        item?.isActive && new Date(item.endDate).getTime() > Date.now(),
    ) ?? [];

  return {
    totalPage: data?.totalPages ?? 0,
    latestCompetitions: latestCompetitions?.sort(
      (a: Competitions, b: Competitions) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    ),
  };
};

type Props = Promise<{
  trang: string;
}>;

const CompetitionsPage = async ({ searchParams }: { searchParams: Props }) => {
  const { trang } = await searchParams;

  const page = trang ? Number(trang) : 1;
  const { totalPage, latestCompetitions } = await fetchLatestCompetitions(page);

  return (
    <div className="min-h-screen ">
      <section className="container mx-auto px-4 py-12 md:py-16 rounded-lg ">
        <h2 className="text-3xl font-bold text-center mb-10 text-primary">
          Cuộc thi mới nhất
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestCompetitions?.map((item) => (
            <CompetitionArticleCard
              key={item._id}
              description={item.description}
              endDate={formatDate(item.endDate, "HH [giờ] dddd, DD/MM")}
              image={item.image_url}
              slug={item.slug}
              startDate={formatDate(item.startDate, "HH [giờ] dddd, DD/MM")}
              status={item.status}
              title={item.title}
            />
          ))}
        </div>
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={page != 1 ? `?trang=${page - 1}` : ""}
              />
            </PaginationItem>
            {page > 1 && (
              <PaginationItem>
                <PaginationLink href={`?trang=${page - 1}`}>
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink isActive href={`?trang=${page}`}>
                {page}
              </PaginationLink>
            </PaginationItem>
            {page < totalPage && (
              <PaginationItem>
                <PaginationLink href={`?trang=${page + 1}`}>
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href={
                  page < totalPage
                    ? `?trang=${page + 1}`
                    : `?trang=${totalPage}`
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </div>
  );
};

export default CompetitionsPage;
