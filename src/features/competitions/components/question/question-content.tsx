import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Question } from "../../type.competitions";

import { cn } from "@/utils/cn";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/custom-radio-group";
import UploadImage from "@/components/ui/upload-image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
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
});

const QuestionContent = ({
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    shouldFocusError: false,
    defaultValues: {
      question: "",
      image: "",
      correct_answer: "",
      answer: [],
    },
  });
  const lastSubmitted = React.useRef<string>("");

  React.useEffect(() => {
    form.reset(questions.at(currentQuestion) as z.infer<typeof formSchema>);
  }, [currentQuestion]);

  function handleResetForm() {
    form.reset({
      question: "",
      image: "",
      correct_answer: "",
      answer: [],
    });
  }

  const getValueField = (field: string): string | undefined => {
    const fieldValue = form.getValues(
      field as keyof z.infer<typeof formSchema>,
    );

    if (fieldValue === undefined) return undefined;

    return fieldValue?.length > 0 ? (fieldValue as string) : undefined;
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      ...values,
      correct_answer: getValueField(values.correct_answer),
    };

    try {
      setQuestion((prev) =>
        prev.toSpliced(currentQuestion, 1, {
          _id: prev?.at(currentQuestion)?._id ?? "0",
          ...data,
        }),
      );
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>,
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  React.useEffect(() => {
    const timeout = setTimeout(async () => {
      const valid = await form.trigger();
      const current = JSON.stringify(form.getValues());

      if (valid && current !== lastSubmitted.current) {
        lastSubmitted.current = current;
        form.handleSubmit(onSubmit)();
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [form.watch(), form.handleSubmit, form.trigger]);

  const handleDeleteQuestion = () => {
    if (questions.length <= 1) {
      toast.error("Không thể xóa câu hỏi đầu tiên");

      return;
    }
    if (currentQuestion >= questions.length) return;
    setQuestion((prev) => prev.toSpliced(currentQuestion, 1));
    if (currentQuestion === questions.length - 1) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8 max-w-3xl mx-auto py-10">
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
                <UploadImage {...field} />
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
                                "flex flex-row items-center space-x-3 transition-colors duration-500 ease-in-out space-y-0 rounded-md border px-4",
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
                                "flex flex-row !m-0 items-center space-x-3 transition-colors duration-500 ease-in-out space-y-0 rounded-md border px-4",
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
                                "flex flex-row items-center space-x-3 transition-colors duration-500 ease-in-out space-y-0 rounded-md border px-4",
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
                                "flex flex-row items-center space-x-3 transition-colors duration-500 ease-in-out space-y-0 rounded-md border px-4",
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
          <Button type="reset" variant="ghost" onClick={handleResetForm}>
            Cài lại câu hỏi
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteQuestion}
          >
            Xóa câu hỏi
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionContent;
