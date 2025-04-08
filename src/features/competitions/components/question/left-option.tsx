import React from "react";

import { Question } from "../../type.competitions";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const initialQuestion: Question = {
  _id: "1",
  question: "",
  correct_answer: "",
  answer: [],
  options: {
    timeLimit: "20",
    point: "standard",
  },
};
const LeftOption = ({
  questions,
  setQuestion,
  currentQuestion,
  setCurrentQuestion,
}: {
  questions: Question[];
  currentQuestion: number;
  setQuestion: React.Dispatch<React.SetStateAction<Question[]>>;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const handleAddQuestion = () => {
    setQuestion((prev) => [...prev, initialQuestion]);
    setCurrentQuestion(questions.length);
  };
  const handleChangeCurrentQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  return (
    <div className="h-full overflow-y-scroll p-2 dark:bg-gray-600 bg-gray-200 rounded-lg">
      <div className="flex items-center gap-2 mb-4" />
      {questions?.map((question, index: number) => (
        <Button
          key={index}
          className={cn(
            "rounded flex items-center w-full p-2 mb-4 cursor-pointer",
            currentQuestion !== index && "bg-gray-700",
          )}
          variant={currentQuestion === index ? "outline" : "secondary"}
          onClick={() => handleChangeCurrentQuestion(index)}
        >
          Câu {index + 1}
        </Button>
      ))}
      <Button
        className="w-full mb-2 "
        variant="default"
        onClick={handleAddQuestion}
      >
        Thêm câu hỏi
      </Button>
    </div>
  );
};

export default LeftOption;
