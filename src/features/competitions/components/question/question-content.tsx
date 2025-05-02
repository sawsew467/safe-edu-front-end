import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Question } from "../../type.competitions";
import { useDeleteQuestionMutation } from "../../api.admin.question";

import { formSchema } from "./question-management";

import { cn } from "@/utils/cn";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/custom-radio-group";
import UploadImage from "@/components/ui/upload-image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const QuestionContent = ({
  questions,
  currentQuestion,
  form,
  setCurrentQuestion,
}: {
  questions: Question[];
  currentQuestion: number;
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [deleteQuestion, { isLoading: isLoadingDeleteQuestion }] =
    useDeleteQuestionMutation();

  function handleResetForm() {
    form.reset(
      {
        question: "",
        image: "",
        correct_answer: "",
        answer: [],
        time_limit: "20",
        point: "10",
      },
      { keepDirty: false },
    );
  }

  const getValueField = (field: string): string | undefined => {
    const fieldValue = form.getValues(
      field as keyof z.infer<typeof formSchema>,
    );

    if (fieldValue === undefined) return undefined;

    return typeof fieldValue === "string" && fieldValue.length > 0
      ? fieldValue
      : undefined;
  };

  const handleDeleteQuestion = async () => {
    if (questions.length <= 1) {
      toast.error("Không thể xóa câu hỏi đầu tiên");

      return;
    }
    // const idToast = toast.loading("Đang xóa câu hỏi...");

    try {
      await deleteQuestion({
        id: questions?.at(currentQuestion)?._id,
      });
      setCurrentQuestion(currentQuestion > 0 ? currentQuestion - 1 : 0);
      // toast.success("Xóa câu hỏi thành công", { id: idToast });
    } catch {
      // toast.error("Xóa câu hỏi thất bại", { id: idToast });
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-10">
      <FormField
        control={form.control}
        name="question"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="Nhập câu hỏi..."
                {...field}
                className="flex min-h-9 overflow-hidden justify-center text-center h-10 resize-none"
                value={field.value ?? ""}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <UploadImage {...field} maxHeight={110} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="correct_answer"
        render={({ field: field_correctAnswer }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                value={field_correctAnswer.value || ""}
                onValueChange={(e) => {
                  if (getValueField(e)) {
                    field_correctAnswer.onChange(e);
                  }
                }}
              >
                <FormField
                  control={form.control}
                  name="answer"
                  render={() => (
                    <FormItem className="grid grid-cols-2 grid-rows-2 gap-2">
                      <FormField
                        control={form.control}
                        name="answer.0"
                        render={({ field }) => (
                          <FormItem
                            className={cn(
                              "flex flex-row items-center space-x-3 transition-[background] duration-500 ease-in-out space-y-0 rounded-md border px-4",
                              field.value
                                ? "bg-primary dark:text-black text-white"
                                : "bg-none",
                            )}
                          >
                            <FormControl>
                              <Input
                                {...field}
                                autoComplete="off"
                                className="border-none h-full focus-visible:ring-0"
                                placeholder="Nhập câu trả lời 1"
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={"answer.0"} />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="answer.1"
                        render={({ field }) => (
                          <FormItem
                            className={cn(
                              "flex flex-row !m-0 items-center space-x-3 transition-[background] duration-500 ease-in-out space-y-0 rounded-md border px-4",
                              field.value
                                ? "bg-primary dark:text-black text-white"
                                : "bg-none",
                            )}
                          >
                            <FormControl>
                              <Input
                                {...field}
                                autoComplete="off"
                                className=" border-none h-full focus-visible:ring-0"
                                placeholder="Nhập câu trả lời 2"
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={"answer.1"} />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="answer.2"
                        render={({ field }) => (
                          <FormItem
                            className={cn(
                              "flex flex-row items-center space-x-3 transition-[background] duration-500 ease-in-out space-y-0 rounded-md border px-4",
                              field.value
                                ? "bg-primary dark:text-black text-white"
                                : "bg-none",
                            )}
                          >
                            <FormControl>
                              <Input
                                {...field}
                                autoComplete="off"
                                className=" border-none h-16 focus-visible:ring-0"
                                placeholder="Nhập câu trả lời 3"
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={"answer.2"} />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="answer.3"
                        render={({ field }) => (
                          <FormItem
                            className={cn(
                              "flex flex-row items-center space-x-3 transition-[background] duration-500 ease-in-out space-y-0 rounded-md border px-4",
                              field.value
                                ? "bg-primary dark:text-black text-white"
                                : "bg-none",
                            )}
                          >
                            <FormControl>
                              <Input
                                {...field}
                                autoComplete="off"
                                className=" border-none autofill:bg-current h-full focus-visible:ring-0"
                                placeholder="Nhập câu trả lời 4"
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={"answer.3"} />
                            </div>
                          </FormItem>
                        )}
                      />
                    </FormItem>
                  )}
                />
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
      <div className="flex w-full justify-end space-x-4">
        <Button
          isLoading={isLoadingDeleteQuestion}
          type="reset"
          variant="ghost"
          onClick={handleResetForm}
        >
          Cài lại câu hỏi
        </Button>
        <Button
          isLoading={isLoadingDeleteQuestion}
          type="button"
          variant="destructive"
          onClick={handleDeleteQuestion}
        >
          Xóa câu hỏi
        </Button>
      </div>
    </div>
  );
};

export default QuestionContent;
