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
  options?: {
    timeLimit: string | null;
    point: string | null;
  };
}
export interface Quizz {
  _id: string;
  title: string;
  type: keyof typeof QuizzType;
  slug: string;
  isActive: boolean;
  status: string;
}
