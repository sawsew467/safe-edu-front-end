import { CheckCircle, XCircle } from "lucide-react";

import { QuestionResult } from "../../type.competitions";

import { cn } from "@/lib/utils";

export default function QuestionResultModule({
  answer,
  index,
}: {
  answer: QuestionResult;
  index: number;
}) {
  const { question_id: question, isCorrect, answer: userAnswer } = answer;

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden",
        isCorrect ? "border-[#75A815]" : "border-red-500 dark:border-red-400",
      )}
    >
      <div className="flex relative items-center p-4 bg-gray-50 dark:bg-gray-800">
        <div
          className={cn(
            "absolute border size-10 rounded-full top-2 right-2",
            isCorrect
              ? "border-[#75A815] text-[#75A815]"
              : "border-red-500 dark:border-red-400 dark:text-red-400 text-red-500",
          )}
        >
          <span className="absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2">
            {question.point}
          </span>
        </div>
        <div className="mr-4">
          {isCorrect ? (
            <CheckCircle className="h-6 w-6 text-[#75A815]" />
          ) : (
            <XCircle className="h-6 w-6 text-red-500" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">
            Câu hỏi {index}: {question.question}
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Câu trả lời của bạn:
          </p>
          <p
            className={`font-medium ${isCorrect ? "text-[#75A815]" : "text-red-600 dark:text-red-400"}`}
          >
            {userAnswer}
          </p>
        </div>
        {!isCorrect && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Đáp án đúng:
            </p>
            <p className="font-medium text-[#75A815]">
              {question.correct_answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
