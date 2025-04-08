import React from "react";

import { Question } from "../../type.competitions";

import QuestionContent from "./question-content";
import RightOption from "./right-option";
import LeftOption from "./left-option";

import { Button } from "@/components/ui/button";
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
const QuestionManagement = ({
  closeDialog,
  id,
}: {
  closeDialog: () => void;
  id: string | null;
}) => {
  const [questions, setQuestion] = React.useState<Question[]>([
    initialQuestion,
  ]);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);

  const handleSave = () => {
    console.log("first", questions);
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="w-full flex justify-between">
        <Button variant="destructive" onClick={closeDialog}>
          Thoát
        </Button>
        <Button variant="default" onClick={handleSave}>
          Lưu
        </Button>
      </div>
      <div className="grid gap-4 min-h-[500px]  grid-cols-6">
        <div className="col-span-1 max-h-[80vh]">
          <LeftOption
            currentQuestion={currentQuestion}
            questions={questions}
            setCurrentQuestion={setCurrentQuestion}
            setQuestion={setQuestion}
          />
        </div>
        <div className="col-span-4">
          <QuestionContent
            currentQuestion={currentQuestion}
            questions={questions}
            setCurrentQuestion={setCurrentQuestion}
            setQuestion={setQuestion}
          />
        </div>
        <div className="col-span-1">
          <RightOption
            currentQuestion={currentQuestion}
            option={questions[currentQuestion].options}
            setOption={setQuestion}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionManagement;
