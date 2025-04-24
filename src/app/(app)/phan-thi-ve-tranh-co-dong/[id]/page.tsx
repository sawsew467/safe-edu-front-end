import React from "react";

import PaintingPropagandaModule from "@/features/competitions/components/quizz/PaintingPropagandaModule";
import { Quizz } from "@/features/competitions/type.competitions";
import { customFetch } from "@/utils/custom-fetch";
import constants from "@/settings/constants";

type Params = Promise<{ id: string }>;

const fetchQuestionByQuizzId = async (id: string) => {
  const { data: quiz } = await customFetch(
    `${constants.API_SERVER}/quiz/${id}`,
  );

  if (!quiz) {
    return {};
  }

  return quiz;
};

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const quizz: Quizz = await fetchQuestionByQuizzId((id ?? "") as string);

  return {
    title: quizz?.title,
    description: quizz?.type,
  };
}

const PaintingPropagandaPage = () => {
  return <PaintingPropagandaModule />;
};

export default PaintingPropagandaPage;
