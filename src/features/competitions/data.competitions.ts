import { Question, Quizz } from "./type.competitions";

import { QuizzType } from "@/settings/enums";

export const initialQuestion: Question = {
  _id: "1",
  question: "",
  correct_answer: "",
  answer: [],
  options: {
    timeLimit: "20",
    point: "standard",
  },
};

export const fakeData: Quizz[] = [
  {
    _id: "1",
    title: "Cuộc thi 1",
    type: "SingleChoice",
    slug: "cuoc-thi-1",
    isActive: true,
    status: "Upcoming",
  },
  {
    _id: "2",
    title: "Cuộc thi 2",
    type: "SingleChoice",
    slug: "cuoc-thi-2",
    isActive: false,
    status: "Upcoming",
  },
  {
    _id: "3",
    title: "Cuộc thi 3",
    type: "SingleChoice",
    slug: "cuoc-thi-3",
    isActive: true,
    status: "Outgoing",
  },
  {
    _id: "4",
    title: "Cuộc thi 4",
    type: "SingleChoice",
    slug: "cuoc-thi-4",
    isActive: false,
    status: "Outgoing",
  },
  {
    _id: "5",
    title: "Cuộc thi 5",
    type: "SingleChoice",
    slug: "cuoc-thi-5",
    isActive: true,
    status: "Ongoing",
  },
  {
    _id: "6",
    title: "Cuộc thi 6",
    type: "SingleChoice",
    slug: "cuoc-thi-6",
    isActive: false,
    status: "Ongoing",
  },
];

export const quizzType = [
  { label: QuizzType.SingleChoice, value: QuizzType.SingleChoice },
  { label: QuizzType.PaintingPropaganda, value: QuizzType.PaintingPropaganda },
  { label: QuizzType.Practical, value: QuizzType.Practical },
  { label: QuizzType.SocialThinking, value: QuizzType.SocialThinking },
];
