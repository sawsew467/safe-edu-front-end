import { Organization } from "../organizations/types";
import { Citizens, Student } from "../users/user.types";

import { QuizzType } from "@/settings/enums";

export interface Competitions {
  _id: string;
  isActive: boolean;
  deleted_at: string;
  deleted_by: string | null;
  created_by: string | null;
  update_by: string | null;
  title: string;
  number_join: number;
  description: string;
  startDate: string;
  endDate: string;
  image_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  slug: string;
  id: string;
  organizationId: Organization;
}

export interface Question {
  _id: string;
  question: string | null;
  answer: (string | undefined)[];
  correct_answer?: string | null;
  image?: string;
  time_limit: string | null;
  point: string | null;
  isSaveBefore?: boolean;
  isSave?: boolean;
  current_question: number;
  quiz_id?: Quizz[];
}

export interface QuestionQuizz {
  quiz_id: Quizz[];
  _id: string;
  isActive: boolean;
  deleted_at?: string | null;
  deleted_by?: string | null;
  created_by?: string | null;
  update_by?: string | null;
  question?: string;
  image?: string;
  answer: string[];
  correct_answer: string;
  time_limit: number;
  point: number;
  created_at: string;
  updated_at: string;
  __v: 0;
  id: string;
}

export interface QuizResultQuestion {
  _id: string;
  isActive: boolean;
  user_id: string;
  quiz_id: Quizz;
  questions: QuestionResult[];
  answer: string;
  isCorrect: boolean;
  score: number;
  totalQuestion: number;
  created_at: string;
  updated_at: string;
  id: string;
  completedAt: string;
  startAt: string;
}

export interface QuestionResult extends Question {
  isCorrect: boolean;
  question_id: Question;
}

export interface Quizz {
  _id: string;
  title: string;
  type: keyof typeof QuizzType;
  slug: string;
  isActive: boolean;
  status: string;
  competitionId: string[];
}

export type Picture = {
  _id: string;
  isActive: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  update_by: string | null;
  picture: string;
  name: string;
  description: string;
  user_id: Student | Citizens;
  quiz_id: Quizz;
  startedAt: string;
  completedAt: string;
  created_at: string;
  updatedAt: string;
  score?: number | null;
  feedback: string | null;
  quiz_result_id?: string;
  __v: number;
  id: string;
};
