"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  title: z
    .string({ message: "Đây là trường bắt buộc." })
    .min(1, { message: "Đây là trường bắt buộc." }),
  type: z
    .string({ message: "Đây là trường bắt buộc." })
    .min(1, { message: "Đây là trường bắt buộc." }),
});

import { toast } from "sonner";
import { skipToken } from "@reduxjs/toolkit/query";

import { quizzType } from "../../data.competitions";
import {
  useGetQuizzQuery,
  useUpdateQuizzMutation,
} from "../../api.admin.quizz";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/comboBox";
import { Spinner } from "@/components/ui/spinner";

const FormUpdateQuizz = ({
  setOpenDialog,
  competitionId,
  idDialogQuestion,
}: {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  competitionId: string;
  idDialogQuestion: string | null;
}) => {
  const [updateQuizz, { isLoading }] = useUpdateQuizzMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
    },
  });

  const { quizz, isFetching } = useGetQuizzQuery(
    idDialogQuestion ? { id: idDialogQuestion } : skipToken,
    {
      selectFromResult: ({ data, isFetching }) => ({
        quizz: data?.data,
        isFetching: isFetching,
      }),
    },
  );

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const idToast = toast.loading("Đang thêm mới phần thi");

    updateQuizz({
      params: { id: idDialogQuestion },
      body: { ...data, competitionId },
    })
      .unwrap()
      .then(() => {
        toast.success("Thêm mới phần thi thành công", { id: idToast });
      })
      .catch((error: any) => {
        toast.error(error?.data?.message, { id: idToast });
      });
    handleBack();
  };

  useEffect(() => {
    if (quizz) form.reset(quizz);
  }, [quizz]);
  const handleBack = () => {
    setOpenDialog(false);
  };

  if (isFetching)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    );

  return (
    <Form {...form}>
      <form
        className="space-y-8 flex flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Tiêu đề</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu đề" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thể loại phần thi</FormLabel>
              <FormControl>
                <Combobox
                  className="w-full"
                  options={quizzType}
                  placeholder="Chọn thể loại phần thi"
                  value={field.value}
                  variant="outline"
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-center">
          <Button
            className="font-medium"
            type="button"
            variant="destructive"
            onClick={handleBack}
          >
            Hủy tác vụ
          </Button>
          <Button className="font-medium" type="submit">
            Thêm
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormUpdateQuizz;
