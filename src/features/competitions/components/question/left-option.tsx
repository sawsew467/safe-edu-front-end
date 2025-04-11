import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Question } from "../../type.competitions";
import { useAddNewQuestionMutation } from "../../api.question";

import { formSchema } from "./question-management";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
const initialQuestion: Question = {
  _id: "1",
  question: "",
  image: "",
  correct_answer: "",
  answer: [],
  time_limit: "20",
  point: "10",
  isSaveBefore: false,
  isSave: false,
  current_question: 0,
};
const LeftOption = ({
  questions,
  currentQuestion,
  quizzId,
  form,
}: {
  questions: Question[];
  currentQuestion: number;
  quizzId: string;
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
}) => {
  const [addQuestion, { isLoading: isLoadingAddQuestion }] =
    useAddNewQuestionMutation();

  const handleAddQuestion = async (
    funcFieldChange: (question: number, option: any) => void,
  ) => {
    funcFieldChange(questions.length, { shouldDirty: false });
    await addQuestion({
      quiz_id: quizzId,
      question: "test",
      image: "",
      correct_answer: "test1",
      answer: ["test1", "test2"],
      time_limit: 20,
      point: 10,
    }).unwrap();
  };

  return (
    <div className="h-full overflow-y-scroll p-2 dark:bg-gray-600 bg-gray-200 rounded-lg">
      <FormField
        control={form.control}
        name="current_question"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <React.Fragment>
                {questions?.map((question, index: number) => (
                  <Button
                    key={question._id}
                    className={cn(
                      "rounded flex items-center w-full p-2 mb-4 cursor-pointer",
                      currentQuestion !== index && "bg-gray-700",
                    )}
                    variant={
                      currentQuestion === index ? "outline" : "secondary"
                    }
                    onClick={() =>
                      field.onChange(index, { shouldDirty: false })
                    }
                  >
                    Câu {index + 1}
                  </Button>
                ))}
                <Button
                  className="w-full mb-2 "
                  variant="default"
                  onClick={() => handleAddQuestion(field.onChange)}
                >
                  Thêm câu hỏi
                </Button>
              </React.Fragment>
            </FormControl>
          </FormItem>
        )}
      />
      {/* <div className="flex items-center gap-2 mb-4" /> */}
    </div>
  );
};

export default LeftOption;
