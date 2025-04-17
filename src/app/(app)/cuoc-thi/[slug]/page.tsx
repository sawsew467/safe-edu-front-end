import React from "react";
import { ArrowRight, Calendar, Clock } from "lucide-react";

import constants from "@/settings/constants";
import { Competitions, Quizz } from "@/features/competitions/type.competitions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format-date";
import QuizzArticleCard from "@/features/competitions/components/quizz/quizz-artile-card";
type Params = Promise<{ slug: string }>;
const fetchQuizzByIdCompetition = async (slug: string) => {
  const res = await fetch(
    `${constants.API_SERVER}/quiz/get-all-by-slug/${slug}`,
  );

  const { data } = await res.json();

  return data?.data;
};

const fetchCompetitionsById = async (slug: string) => {
  const res = await fetch(`${constants.API_SERVER}/competitions/slug/${slug}`);

  const { data } = await res.json();

  return data;
};

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const competition: Competitions = await fetchCompetitionsById(
    (slug ?? "") as string,
  );

  return {
    title: competition?.title,
    description: competition?.description,
    date: `${new Date(competition?.startDate).toLocaleDateString()} - ${new Date(
      competition?.endDate,
    ).toLocaleDateString()}`,
  };
}

const QuizzPage = async (props: { params: Params }) => {
  const { slug } = await props.params;

  const competition: Competitions = await fetchCompetitionsById(
    (slug ?? "") as string,
  );
  const quizzs: Quizz[] = await fetchQuizzByIdCompetition(
    (slug ?? "") as string,
  );

  console.log("competition", competition);

  if (!quizzs || quizzs.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4 px-4">
        <h1 className="text-center font-semibold md:text-3xl text-lg">
          Phần thi đang được chuẩn bị hãy quay lại sau nhé!
        </h1>
        <form action={`/cuoc-thi`} method="get">
          <Button type="submit">Quay lại cuộc thi</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-12 md:py-16 rounded-lg ">
        <h2 className="text-3xl font-bold text-center mb-10 text-primary">
          Các phần cuộc thi về{" "}
          <span className=" uppercase">{competition?.title}</span>
        </h2>
        <div className="bg-primary/30 rounded-lg shadow-sm p-4 max-w-2xl mb-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex items-center">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mr-2">
                BẮT ĐẦU
              </Badge>
              <div className="flex flex-col items-start">
                <div className="flex items-center text-gray-700 dark:text-gray-100">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="font-medium">
                    {formatDate(competition?.startDate, "dddd, DD/MM")}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-200 text-sm">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>
                    {formatDate(competition?.startDate, "HH [giờ] mm [phút]")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="mx-2 text-gray-400 dark:text-gray-50" />
            </div>

            <div className="flex items-center">
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100 mr-2">
                KẾT THÚC
              </Badge>
              <div className="flex flex-col items-start">
                <div className="flex items-center text-gray-700 dark:text-gray-100">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="font-medium">
                    {formatDate(competition?.endDate, "dddd, DD/MM")}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-200 text-sm">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>
                    {formatDate(competition?.endDate, "HH [giờ] mm [phút]")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzs?.map((quizz) => (
            <QuizzArticleCard
              key={quizz?._id}
              slug={quizz?._id}
              title={quizz?.title}
              type={quizz?.type}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default QuizzPage;
