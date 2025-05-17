import React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { skipToken } from "@reduxjs/toolkit/query";

import { Question, QuestionQuizz } from "../../type.competitions";
import {
  useAddNewQuestionMutation,
  useGetQuestionByQuizzIdQuery,
  useUpdateQuestionMutation,
} from "../../api.admin.question";

import QuestionContent from "./question-content";
import RightOption from "./right-option";
import LeftOption from "./left-option";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

export const formSchema = z.object({
  question: z.string({ message: "Câu hỏi không được để trống" }).optional(),
  image: z.string().optional(),
  correct_answer: z
    .string({ message: "Chưa chọn đáp án đúng" })
    .min(1, "Chưa chọn đáp án đúng"),
  answer: z.array(
    z
      .string()
      .min(1, "Câu trả lời không được để trống")
      .max(75, "Độ dài câu trả lời không được quá 75 kí tự")
      .optional(),
    {
      message: "Danh sách câu trả lời không hợp lệ",
    },
  ),
  time_limit: z.string(),
  current_question: z.number(),
  point: z.string(),
});

const QuestionManagement = ({ closeDialog }: { closeDialog: () => void }) => {
  const params = useSearchParams();
  const quizzId = params.get("id") as string;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldFocusError: false,
  });

  const {
    questionsQuizzs,
    isSuccess,
  }: { questionsQuizzs: Question[]; isSuccess: boolean } =
    useGetQuestionByQuizzIdQuery(quizzId ? { id: quizzId } : skipToken, {
      selectFromResult: ({ data, isSuccess }) => ({
        questionsQuizzs:
          data?.data?.data?.map((question: QuestionQuizz) => ({
            _id: question?._id ?? "",
            question: question?.question ?? "",
            image: question?.image ?? "",
            answer: question?.answer ?? [],
            correct_answer: `answer.${question?.answer?.findIndex((ans) => ans === question?.correct_answer)}`,
            time_limit: question?.time_limit?.toString() ?? "20",
            point: question?.point?.toString() ?? "10",
            isSaveBefore: true,
            isSave: true,
          })) ?? [],
        isSuccess,
      }),
    });
  const [addQuestion, { isLoading: isLoadingAddQuestion }] =
    useAddNewQuestionMutation();
  const [updateQuestion, { isLoading: isLoadingUpdateQuestion }] =
    useUpdateQuestionMutation();

  const [currentQuestion, setCurrentQuestion] = React.useState(0);

  const { current_question, ...dirtyFields } = form.formState.dirtyFields;
  const isDirty = Object.keys(dirtyFields).length > 0;

  const addFirstQuestion = async () => {
    await addQuestion({
      quiz_id: quizzId,
      question: "",
      image: "",
      correct_answer: "",
      answer: [],
      time_limit: 20,
      point: 10,
    }).unwrap();
  };

  React.useEffect(() => {
    if (questionsQuizzs?.length > 0) {
      form.reset(
        questionsQuizzs.at(currentQuestion) as z.infer<typeof formSchema>,
        {
          keepDirty: false,
        },
      );
    } else if (isSuccess) {
      addFirstQuestion();
    }
  }, [currentQuestion, isSuccess, JSON.stringify(questionsQuizzs)]);

  const handleSave = async () => {
    onSubmit(form.getValues() as z.infer<typeof formSchema>);
    closeDialog();
  };

  const getValueField = (field: string): string | undefined => {
    const fieldValue = form.getValues(
      field as keyof z.infer<typeof formSchema>,
    );

    if (fieldValue === undefined) return undefined;

    return typeof fieldValue === "string" && fieldValue.length > 0
      ? fieldValue
      : undefined;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { current_question, ...rest } = values;

    if (!isDirty) {
      setCurrentQuestion(current_question);

      return;
    }
    const data = {
      ...rest,
      answer: values.answer.filter((item) => item),
      correct_answer: getValueField(values.correct_answer),
    };

    // const idToast = toast.loading("Đang lưu câu hỏi...");

    try {
      if (questionsQuizzs?.at(currentQuestion)?.isSaveBefore) {
        await updateQuestion({
          params: { id: questionsQuizzs?.at(currentQuestion)?._id },
          body: { quiz_id: quizzId, ...data },
        }).unwrap();
        // toast.success("Cập nhật câu hỏi thành công", { id: idToast });
      } else {
        await addQuestion({
          quiz_id: quizzId,
          ...data,
        }).unwrap();
      }
      // toast.success("Lưu câu hỏi thành công", { id: idToast });
    } catch (error) {
      // toast.error("Lưu câu hỏi thất bại", { id: idToast });
    } finally {
      setCurrentQuestion(current_question);
    }
  }

  const onInvalid = () => {
    setCurrentQuestion(form.getValues("current_question"));
  };

  return (
    <div className="space-y-4 pt-4">
      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        >
          <div className="w-full flex justify-between">
            <Button type="button" variant="destructive" onClick={closeDialog}>
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
                form={form}
                questions={questionsQuizzs}
                quizzId={quizzId}
              />
            </div>
            <div className="col-span-4">
              <QuestionContent
                currentQuestion={currentQuestion}
                form={form}
                questions={questionsQuizzs}
                setCurrentQuestion={setCurrentQuestion}
              />
            </div>
            <div className="col-span-1">
              <RightOption form={form} />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QuestionManagement;
