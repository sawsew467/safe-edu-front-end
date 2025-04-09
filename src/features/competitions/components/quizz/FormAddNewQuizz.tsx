"use client";
import React from "react";
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

import { quizzType } from "../../data.competitions";
import { useAddNewQuizzMutation } from "../../api.quizz";

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

const AddNewQuizz = ({
  setOpenDialog,
}: {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [addQuizz, { isLoading }] = useAddNewQuizzMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const idToast = toast.loading("Đang thêm mới phần thi");

    addQuizz(data)
      .unwrap()
      .then(() => {
        toast.success("Thêm mới phần thi thành công", { id: idToast });
        setOpenDialog(false);
      })
      .catch((error) => {
        toast.error(error.data.message, { id: idToast });
      });
  };
  const handleBack = () => {
    setOpenDialog(false);
  };

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
                  <Input placeholder="nhập tiêu đề" {...field} />
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
              <FormLabel>Thể loại cuộc thi</FormLabel>
              <FormControl>
                <Combobox
                  className="w-full"
                  options={quizzType}
                  placeholder="Chọn thể loại cuộc thi"
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

export default AddNewQuizz;
