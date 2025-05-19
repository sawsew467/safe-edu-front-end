import React from "react";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";

import constants from "@/settings/constants";
import { Competitions, Quizz } from "@/features/competitions/type.competitions";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format-date";
import QuizzArticleCard from "@/features/competitions/components/quizz/quizz-artile-card";
import { customFetch } from "@/utils/custom-fetch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PremiumLeaderboard from "@/features/competitions/components/quizz/leaderBoad";
type Params = Promise<{ slug: string }>;
const fetchQuizzByIdCompetition = async (slug: string) => {
  const { data } = await customFetch(
    `${constants.API_SERVER}/competitions/get-all-quiz-by-slug/${slug}`
  );

  return data?.data;
};

const fetchCompetitionsById = async (slug: string) => {
  const { data } = await customFetch(
    `${constants.API_SERVER}/competitions/slug/${slug}`
  );

  return data;
};

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const competition: Competitions = await fetchCompetitionsById(
    (slug ?? "") as string
  );

  return {
    title: competition?.title,
    description: competition?.description,
    date: `${new Date(competition?.startDate).toLocaleDateString()} - ${new Date(
      competition?.endDate
    ).toLocaleDateString()}`,
  };
}

const QuizzPage = async (props: { params: Params }) => {
  const { slug } = await props.params;
  const quizzs: Quizz[] = await fetchQuizzByIdCompetition(
    (slug ?? "") as string
  );

  const competition: Competitions = await fetchCompetitionsById(
    (slug ?? "") as string
  );

  const status =
    new Date(competition?.startDate) > new Date()
      ? "Upcoming"
      : new Date(competition?.endDate) < new Date()
        ? "Outgoing"
        : "Ongoing";

  const tabs = [
    {
      name: "Phần thi",
      value: "phan-thi",
      content: () => (
        <div className="grid mt-6 gap-6">
          {quizzs?.length != 0 ? (
            quizzs?.map((quizz) => (
              <QuizzArticleCard
                key={quizz?._id}
                id={quizz?._id}
                slug={quizz?._id}
                status={status}
                title={quizz?.title}
                type={quizz?.type}
              />
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <h1 className="text-2xl font-bold text-center text-gray-500">
                Chưa có phần thi nào cho cuộc thi này
              </h1>
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Xếp hạng",
      value: "xep-hang",
      content: () => (
        <div className="w-full">
          {quizzs?.length != 0 ? (
            <PremiumLeaderboard slug={slug} />
          ) : (
            <div className="flex mt-6 items-center justify-center w-full h-full">
              <h1 className="text-2xl font-bold text-center text-gray-500">
                Chưa có phần thi nào cho cuộc thi này
              </h1>
            </div>
          )}
        </div>
      ),
    },
  ];

  if (!quizzs) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <h1 className="text-2xl font-bold text-center text-gray-500">
          Không tìm thấy cuộc thi nào.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <section className="container mx-auto pb-12 md:pb-16 rounded-lg ">
        <div className="w-full xl:h-[500px] lg:h-[400px] md:h-[400px] h-[300px] overflow-hidden mb-4 relative">
          <Image
            alt={`Hình ảnh về cuộc thi ${competition?.title}`}
            className="w-full h-full object-cover"
            height={1000}
            src={competition?.image_url || "/placeholder.svg"}
            width={1000}
          />
          <div className="absolute w-full left-0 bottom-0 h-80 z-10 bg-gradient-to-t from-black/40 to-black/0" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20  lg:max-w-2xl md:max-w-none w-[90%] mb-4 mx-auto">
            <h2 className="lg:text-3xl md:text-2xl text-xl font-bold text-center mb-2 text-white">
              <span className=" uppercase">{competition?.title}</span>
            </h2>
            <div className="flex items-center bg-[#f2f7e5]/50 backdrop-blur-xl rounded-lg shadow-sm lg:p-4 p-2 justify-center gap-4">
              <div className="flex md:flex-row flex-col items-center">
                <Badge className="bg-green-100 text-[#75A815] border-[#e5efd1] hover:bg-green-100 mr-2">
                  BẮT ĐẦU
                </Badge>
                <div className="flex flex-col items-start">
                  <div className="flex items-center text-[#4a6b0e]">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="font-medium capitalize">
                      {formatDate(competition?.startDate, "dddd, DD/MM")}
                    </span>
                  </div>
                  <div className="flex items-center text-[#4a6b0e] ">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="font-medium">
                      {formatDate(competition?.startDate, "HH [giờ] mm [phút]")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center lg:block hidden">
                <ArrowRight className="mx-2 text-gray-800 dark:text-gray-50" />
              </div>

              <div className="flex md:flex-row flex-col items-center">
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100 mr-2">
                  KẾT THÚC
                </Badge>
                <div className="flex flex-col items-start">
                  <div className="flex items-center text-red-800 ">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="font-medium capitalize">
                      {formatDate(competition?.endDate, "dddd, DD/MM")}
                    </span>
                  </div>
                  <div className="flex items-center text-red-800 ">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      {formatDate(competition?.endDate, "HH [giờ] mm [phút]")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Tabs className="w-full px-4" defaultValue={tabs[0].value}>
          <TabsList className="w-full p-0 bg-background justify-start border-b rounded-none">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                className="rounded-none bg-background h-full data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary"
                value={tab.value}
              >
                <p className="text-xl font-semibold">{tab.name}</p>
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content()}
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
};

export default QuizzPage;
