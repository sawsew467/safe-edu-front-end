"use server";
import React from "react";
import { redirect } from "next/navigation";

import constants from "@/settings/constants";
import { Question, Quizz } from "@/features/competitions/type.competitions";
import PartCompetitionQuizz from "@/features/competitions/components/quizz/PartCompetitionQuizz";
import { Button } from "@/components/ui/button";
import { customFetch } from "@/utils/custom-fetch";

type Params = Promise<{ id: string }>;
const fetchQuestionByQuizzId = async (id: string) => {
  const { data } = await customFetch(
    `${constants.API_SERVER}/questions/get-all-by-quizId/${id}?filter={"isActive":"true"}`,
  );

  if (!data) {
    return {};
  }

  const firstQuestion: Question = data?.data?.at(0);
  const quizz = firstQuestion?.quiz_id?.at(0);
  const question = data?.data.map((item: any) => {
    const { _id, image, answer, question, point, time_limit } = item;

    return { _id, image, answer, question, point, time_limit };
  });

  return {
    quizz,
    question,
  };
};

const isSubmitted = async (id: string) => {
  const { data } = await customFetch(
    `${constants.API_SERVER}/quiz-result/is-submit/${id}`,
  );

  return data;
};

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const { quizz }: { quizz?: Quizz } = await fetchQuestionByQuizzId(
    (id ?? "") as string,
  );

  return {
    title: quizz?.title,
    description: quizz?.type,
  };
}

export interface PartQuestion
  extends Pick<
    Question,
    "_id" | "image" | "answer" | "question" | "point" | "time_limit"
  > {}

export default async function PartCompetitions({ params }: { params: Params }) {
  const { id } = await params;
  const data = await isSubmitted(id as string);

  if (data?.isSubmit) redirect(`/phan-thi/${id}/ket-qua`);
  const { question, quizz }: { question?: PartQuestion[]; quizz?: Quizz } =
    await fetchQuestionByQuizzId((id ?? "") as string);

  if (question?.length === 0)
    return (
      <div className="h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-center font-semibold md:text-3xl text-lg">
          Bộ câu hỏi đang được chuẩn bị hãy quay lại sau nhé!
        </h1>
        <form action={`/cuoc-thi`} method="get">
          <Button type="submit">Quay lại cuộc thi</Button>
        </form>
      </div>
    );

  return (
    <div className="h-screen ">
      <PartCompetitionQuizz question={question} title={quizz?.title} />
    </div>
  );
}
