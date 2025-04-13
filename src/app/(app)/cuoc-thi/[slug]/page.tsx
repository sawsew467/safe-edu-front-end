import React from "react";

import constants from "@/settings/constants";
import { Competitions, Quizz } from "@/features/competitions/type.competitions";
import { formatDate } from "@/utils/format-date";
import QuizzArticleCard from "@/features/competitions/components/quizz/quizz-artile-card";
type Params = Promise<{ slug: string }>;
const fetchQuizzByIdCompetition = async (slug: string) => {
  const res = await fetch(
    `${constants.API_SERVER}/quiz/get-all-by-quizId/${slug}`,
  );

  const { data } = await res.json();

  return data?.data;
};

const fetchCompetitionsById = async (slug: string) => {
  const res = await fetch(`${constants.API_SERVER}/competitions/${slug}`);

  const { data } = await res.json();

  return data;
};

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const competition: Competitions = await fetchCompetitionsById(
    (slug ?? "") as string,
  );

  return {
    title: competition.title,
    description: competition.description,
    date: `${new Date(competition.startDate).toLocaleDateString()} - ${new Date(
      competition.endDate,
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

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-12 md:py-16 rounded-lg ">
        <h2 className="text-3xl font-bold text-center mb-10 text-primary">
          Các phần cuộc thi về{" "}
          <span className=" uppercase">{competition?.title}</span>
        </h2>
        <p className="text-xl font-bold text-center mb-10 text-gray-500">
          Từ{" "}
          {formatDate(competition?.endDate, "HH [giờ] mm [phút], dddd, DD/MM")}{" "}
          Tới{" "}
          {formatDate(
            competition?.startDate,
            "HH [giờ] mm [phút], dddd, DD/MM",
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzs?.map((quizz) => (
            <QuizzArticleCard
              key={quizz._id}
              slug={quizz._id}
              title={quizz.title}
              type={quizz.type}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default QuizzPage;
