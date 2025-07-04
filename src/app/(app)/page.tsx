import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { format } from "date-fns";

import { TypeNews } from "@/features/news/news.type";
import { Library } from "@/features/library/library.type";
import { ArticleCard } from "@/features/news/components/artical-card";
import constants from "@/settings/constants";
import { Competitions } from "@/features/competitions/type.competitions";
import { customFetch } from "@/utils/custom-fetch";
import { CompetitionArticleCard } from "@/features/competitions/components/competition-artile-card";
import { ResourceCard } from "@/features/library/components/resource-card";

export const metadata = {
  title: "Trang chủ",
  description:
    "Nâng cao nhận thức xã hội với các tài nguyên giáo dục về bình đẳng giới, phòng chống ma túy và bạo lực học đường.",
  openGraph: {
    title: "Trang chủ",
    description:
      "Nâng cao nhận thức xã hội với các tài nguyên giáo dục về bình đẳng giới, phòng chống ma túy và bạo lực học đường.",
    url: "https://www.safe-edu.site/trang-chu",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 800,
        height: 600,
        alt: "SafeEdu Home",
      },
    ],
  },
};

const fetchLatestNews = async () => {
  try {
    const res = await fetch(`${constants.API_SERVER}/news`);

    const data = await res.json();

    const latestNews =
      data?.data?.items?.filter((item: TypeNews) => item?.isActive) ?? [];

    return latestNews
      ?.sort(
        (a: TypeNews, b: TypeNews) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 3);
  } catch (error) {
    console.log("🚀 ~ fetchLatestNews ~ error:", error);

    return [];
  }
};
const fetchLatestCompetitions = async (): Promise<{
  totalPage: number;
  latestCompetitions: Competitions[];
}> => {
  try {
    const { data } = await customFetch(
      `${constants.API_SERVER}/competitions?pageNumber=${1}&pageSize=100`
    );

    console.log("🚀 ~ fetchLatestCompetitions ~ data:", data);

    const latestCompetitions =
      data
        ?.filter(
          (item: Competitions) =>
            item?.isActive && new Date(item.endDate) > new Date()
        )
        ?.sort(
          (a: Competitions, b: Competitions) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
        .slice(0, 3) ?? [];

    return {
      totalPage: data?.totalPages ?? 0,
      latestCompetitions: latestCompetitions,
    };
  } catch (error) {
    return {
      totalPage: 0,
      latestCompetitions: [],
    };
  }
};

const fetchLatestLibrary = async () => {
  try {
    const res = await fetch(`${constants.API_SERVER}/categories`);
    const data = await res.json();

    const latestLibraries =
      data?.data?.items?.filter((item: Library) => item?.isActive) ?? [];

    return latestLibraries
      ?.sort(
        (a: Library, b: Library) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 6);
  } catch (error) {
    console.log("🚀 ~ fetchLatestLibrary ~ error:", error);

    return [];
  }
};

async function AppPage() {
  const latestNews: TypeNews[] = await fetchLatestNews();

  const latestLibraries: Library[] = await fetchLatestLibrary();

  const { latestCompetitions }: { latestCompetitions: Competitions[] } =
    await fetchLatestCompetitions();

  return (
    <div className="min-h-screen ">
      <section className="relative  text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary uppercase">
                Nâng cao nhận thức xã hội
              </h1>
              <p className="text-xl mb-8 text-black dark:text-white">
                Tài nguyên giáo dục về phòng chống ma túy, bạo lực học đường và
                bình đẳng giới
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                alt="Education illustration"
                className="object-contain w-[400px] h-[400px]"
                height={1000}
                src="/images/app/SafeEdu.png"
                width={1000}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 md:py-16 bg-white dark:bg-card rounded-lg ">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Cuộc thi mới nhất</h2>
          <Link
            className="text-[#8BC34A] hover:underline flex items-center"
            href="/cuoc-thi"
          >
            Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestCompetitions?.map((competition: Competitions) => (
            <CompetitionArticleCard
              key={competition._id}
              description={competition.description}
              endDate={competition.endDate}
              image={competition.image_url}
              slug={competition.slug}
              startDate={competition.startDate}
              title={competition.title}
            />
          ))}
        </div>
      </section>
      <section className="container mx-auto px-4 py-12 md:py-16 bg-white dark:bg-card rounded-lg ">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Tin tức mới nhất</h2>
          <Link
            className="text-[#8BC34A] hover:underline flex items-center"
            href="/tin-tuc"
          >
            Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews?.map((item) => (
            <ArticleCard
              key={item._id}
              category={item.topic_id.topic_name}
              date={format(item.created_at, "dd/MM/yyyy HH:mm:ss")}
              id={item._id}
              image={item.image}
              title={item.title}
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Thư viện giáo dục</h2>
          <Link
            className="text-[#8BC34A] hover:underline flex items-center"
            href="/thu-vien"
          >
            Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestLibraries.map((item, index) => (
            <ResourceCard
              key={item._id}
              description={item.description}
              icon={item.image}
              id={item._id}
              title={item.category_name}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default AppPage;
