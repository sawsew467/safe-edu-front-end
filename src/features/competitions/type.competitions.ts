import { QuizzType } from "@/settings/enums";

export interface Competitions {
  _id: string;
  isActive: boolean;
  deleted_at: string;
  deleted_by: string | null;
  created_by: string | null;
  update_by: string | null;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  id: string;
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
}

export interface QuestionQuizz {
  quiz_id: Quizz[];
  _id: string;
  isActive: boolean;
  deleted_at?: string | null;
  deleted_by?: string | null;
  created_by?: string | null;
  update_by?: string | null;
  question?: string | string;
  answer: string[];
  correct_answer: string;
  time_limit: number;
  point: number;
  created_at: string;
  updated_at: string;
  __v: 0;
  id: string;
}

export interface Quizz {
  _id: string;
  title: string;
  type: keyof typeof QuizzType;
  slug: string;
  isActive: boolean;
  status: string;
}
