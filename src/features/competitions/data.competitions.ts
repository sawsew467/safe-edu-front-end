import { Question } from "./type.competitions";

import { QuizzType } from "@/settings/enums";

export const initialQuestion: Question = {
  _id: "1",
  question: "",
  correct_answer: "",
  answer: [],
  time_limit: "20",
  point: "standard",
  isSaveBefore: false,
  isSave: false,
  current_question: 0,
};

export const quizzType = [
  { label: QuizzType.SingleChoice, value: QuizzType.SingleChoice },
  { label: QuizzType.PaintingPropaganda, value: QuizzType.PaintingPropaganda },
  // { label: QuizzType.Practical, value: QuizzType.Practical },
  // { label: QuizzType.SocialThinking, value: QuizzType.SocialThinking },
];
