"use client";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CustomEditor from "@/components/ui/custom-editor";
import { Input } from "@/components/ui/input";
import UploadImage from "@/components/ui/upload-image";

export type TypeInputLibrary = {
  title: string;
  icon: string;
  desc: string;
};
const initialLibrary = {
  title: "",
  icon: "",
  desc: "",
};
const AddNewLibraryModule = () => {
  const formSchema = z.object({
    title: z
      .string()
      .min(5, { message: "Tiêu đề phải lớn hơn 5 chữ" })
      .max(100, { message: "Tiêu đề quá dài" })
      .trim(),
    icon: z.string(),
    desc: z.string().min(5, { message: "Mô tả phải lớn hơn 5 chữ" }).trim(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: initialLibrary,
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <Card className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <CardHeader className="text-2xl font-bold mb-4">
        Thêm mục thư viện mới
      </CardHeader>
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
                  <FormDescription>
                    Đây là tiêu đề được hiển thị ở bên ngoài thư viện
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <>
                    <UploadImage refetch={() => {}} {...field} />
                  </>
                </FormControl>
                <FormDescription>
                  Đây là icon được hiển thị ở bên ngoài thư viện
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <CustomEditor
                    content={field.name}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Đây là mô tả được hiển thị ở bên trong thư viện
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mx-auto" type="submit">
            Thêm
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default AddNewLibraryModule;
