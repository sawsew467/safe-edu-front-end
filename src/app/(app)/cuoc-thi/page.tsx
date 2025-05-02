import React from "react";

import constants from "@/settings/constants";
import { Competitions } from "@/features/competitions/type.competitions";
import { customFetch } from "@/utils/custom-fetch";
import CompetitionsViewUser from "@/features/competitions/components/competitions-view-user";

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

const fetchLatestCompetitions = async (): Promise<{
  latestCompetitions: Competitions[];
  doingCompetitions: Competitions[];
  donedCompetitions: Competitions[];
}> => {
  let competitions: Competitions[] = [];
  const data = await customFetch(
    `${constants.API_SERVER}/competitions/user?filter={"isActive":"true"}`,
  );

  try {
    if (!data?.data) {
      const { data } = await customFetch(
        `${constants.API_SERVER}/competitions?filter={"isActive":"true"}`,
      );

      competitions = data;
    } else {
      competitions = data?.data;
    }

    const latestCompetitions =
      competitions?.filter(
        (item: Competitions) =>
          item?.isActive && new Date(item.endDate).getTime() > Date.now(),
      ) ?? [];

    const donedCompetitions =
      competitions?.filter((item: Competitions) => item?.status === "done") ??
      [];
    const doingCompetitions =
      competitions?.filter(
        (item: Competitions) =>
          item?.status === "doing" &&
          item?.isActive &&
          new Date(item.endDate).getTime() > Date.now(),
      ) ?? [];

    return {
      latestCompetitions: latestCompetitions?.sort(
        (a: Competitions, b: Competitions) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      ),
      doingCompetitions,
      donedCompetitions,
    };
  } catch (error) {
    return {
      latestCompetitions: [],
      doingCompetitions: [],
      donedCompetitions: [],
    };
  }
};

const CompetitionsPage = async () => {
  const { latestCompetitions, doingCompetitions, donedCompetitions } =
    await fetchLatestCompetitions();

  return (
    <div className="min-h-screen ">
      <section className="container space-y-10 mx-auto px-4 py-12 md:py-16 rounded-lg ">
        <CompetitionsViewUser
          competitions={latestCompetitions}
          label="Cuộc thi mới nhất"
        />
        {donedCompetitions?.length !== 0 && (
          <CompetitionsViewUser
            competitions={donedCompetitions}
            label=" Cuộc thi đã tham gia"
          />
        )}
        {doingCompetitions?.length !== 0 && (
          <CompetitionsViewUser
            competitions={doingCompetitions}
            label="Cuộc thi đang tham gia"
          />
        )}
      </section>
    </div>
  );
};

export default CompetitionsPage;
