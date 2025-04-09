import React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Question, QuestionQuizz } from "../../type.competitions";
import {
  useAddNewQuestionMutation,
  useGetAllQuestionQuery,
  useUpdateQuestionMutation,
} from "../../api.question";

import QuestionContent from "./question-content";
import RightOption from "./right-option";
import LeftOption from "./left-option";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
const initialQuestion: Question = {
  _id: "1",
  question: "",
  correct_answer: "",
  answer: [],
  time_limit: "20",
  point: "10",
  isSaveBefore: false,
  isSave: false,
};

export const formSchema = z.object({
  question: z
    .string({ message: "Câu hỏi không được để trống" })
    .min(1, "Câu hỏi không được để trống"),
  image: z.string().optional(),
  correct_answer: z
    .string({ message: "Chưa chọn đáp án đúng" })
    .min(1, "Chưa chọn đáp án đúng"),
  answer: z
    .array(
      z
        .string()
        .min(1, "Câu trả lời không được để trống")
        .max(75, "Độ dài câu trả lời không được quá 75 kí tự")
        .optional(),
      {
        message: "Danh sách câu trả lời không hợp lệ",
      },
    )
    .refine(
      (arr) =>
        arr.filter((item) => item !== undefined && item.trim() !== "").length >=
        2,
      { message: "Ít nhất phải có 2 câu trả lời hợp lệ" },
    )
    .refine(
      (arr) =>
        arr.filter((item) => item !== undefined && item.trim() !== "").length <=
        4,
      { message: "Câu trả lời không được quá 4 câu hợp lệ" },
    ),
  time_limit: z.string().default("20"),
  point: z.string().default("standard"),
});

const QuestionManagement = ({
  closeDialog,
  id,
}: {
  closeDialog: () => void;
  id: string | null;
}) => {
  const params = useSearchParams();
  const idQuizz = params.get("id") as string;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    shouldFocusError: false,
    defaultValues: {
      question: "",
      image: "",
      correct_answer: "",
      answer: [],
      time_limit: "20",
      point: "10",
    },
  });

  const {
    questionsQuizzs,
    isFetching,
  }: { questionsQuizzs: Question[]; isFetching: boolean } =
    useGetAllQuestionQuery(undefined, {
      selectFromResult: ({ data, isFetching }) => ({
        questionsQuizzs:
          data?.data?.items
            ?.filter(
              (question: QuestionQuizz) =>
                question?.quiz_id?.at(0)?._id === idQuizz,
            )
            ?.map((question: QuestionQuizz) => ({
              _id: question?._id ?? "",
              question: question?.question ?? "",
              answer: question?.answer ?? [],
              correct_answer: `answer.${question?.answer?.findIndex((ans) => ans === question?.correct_answer)}`,
              timeLimit: question?.time_limit?.toString() ?? "20",
              point: question?.point?.toString() ?? "10",
              isSaveBefore: true,
              isSave: true,
            })) ?? [],
        isFetching,
      }),
    });
  const [addQuestion, { isLoading: isLoadingAddQuestion }] =
    useAddNewQuestionMutation();
  const [updateQuestion, { isLoading: isLoadingUpdateQuestion }] =
    useUpdateQuestionMutation();

  const [questions, setQuestion] = React.useState<Question[]>([
    initialQuestion,
  ]);

  const [currentQuestion, setCurrentQuestion] = React.useState(0);

  React.useEffect(() => {
    if (questionsQuizzs) {
      setQuestion(
        questionsQuizzs.length > 0 ? questionsQuizzs : [initialQuestion],
      );
    }
  }, [questionsQuizzs.length]);

  React.useEffect(() => {
    form.reset(questions.at(currentQuestion) as z.infer<typeof formSchema>);
  }, [questions?.at(currentQuestion)]);

  console.log("questions", questions?.at(currentQuestion));

  const handleSave = () => {
    console.log("first", questions);
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
    const data = {
      ...values,
      answer: values.answer.filter((item) => item),
      correct_answer: getValueField(values.correct_answer),
    };

    const idToast = toast.loading("Đang lưu câu hỏi...");

    try {
      if (questions?.at(currentQuestion)?.isSaveBefore) {
        await updateQuestion({
          params: { id: questions?.at(currentQuestion)?._id },
          body: { quiz_id: idQuizz, ...data },
        }).unwrap();

        setCurrentQuestion((prev) =>
          prev < questions.length - 1 ? prev + 1 : prev,
        );
        toast.success("Cập nhật câu hỏi thành công", { id: idToast });
      } else {
        await addQuestion({
          quiz_id: idQuizz,
          ...data,
        }).unwrap();
      }
      toast.success("Lưu câu hỏi thành công", { id: idToast });
    } catch (error) {
      toast.error("Lưu câu hỏi thất bại", { id: idToast });
    }
  }

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
      <Form {...form}>
        <form
          className="grid gap-4 min-h-[500px]  grid-cols-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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
              form={form}
              questions={questions}
              setQuestion={setQuestion}
            />
          </div>
          <div className="col-span-1">
            <RightOption form={form} />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QuestionManagement;
