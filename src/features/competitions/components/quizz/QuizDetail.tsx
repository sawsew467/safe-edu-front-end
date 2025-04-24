import React from "react";
import { skipToken } from "@reduxjs/toolkit/query";

import QuestionManagement from "../question/question-management";
import { useGetQuizzQuery } from "../../api.quizz";

const getModalByType = (type: string, closeDialog: () => void) => {
  switch (type) {
    case QuizzType.SingleChoice:
      return <QuestionManagement closeDialog={closeDialog} />;
    case QuizzType.PaintingPropaganda:
      return <PictureManagement closeDialog={closeDialog} />;
  }
};

import { Quizz } from "../../type.competitions";
import PictureManagement from "../picture/picture-management";

import { Spinner } from "@/components/ui/spinner";
import { QuizzType } from "@/settings/enums";
const QuizDetail = ({
  closeDialog,
  id,
  isOpen,
}: {
  closeDialog: () => void;
  id: string;
  isOpen: boolean;
}) => {
  const { quiz, isFetching }: { quiz: Quizz; isFetching: boolean } =
    useGetQuizzQuery(id ? { id } : skipToken, {
      selectFromResult: ({ data, isFetching }) => ({
        quiz: data?.data,
        isFetching,
      }),
    });

  console.log("quiz", quiz);

  if (isFetching)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner className="size-24" />
      </div>
    );

  return <div>{getModalByType(quiz?.type, closeDialog)}</div>;
};

export default QuizDetail;
