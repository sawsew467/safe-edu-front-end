"use client";
import React from "react";
import { useRouter } from "next-nprogress-bar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { formLibrarySchema } from "../library.schema";

import { Button } from "@/components/ui/button";
import CustomEditor from "@/components/ui/custom-editor";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import UploadImage from "@/components/ui/upload-image";
import { Input } from "@/components/ui/input";
const initialLibrary = {
  title: "",
  icon: "",
  desc: "",
};
const FormAddNewLibrary = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formLibrarySchema>>({
    resolver: zodResolver(formLibrarySchema),
    mode: "onChange",
    defaultValues: initialLibrary,
  });
  const onSubmit = (data: z.infer<typeof formLibrarySchema>) => {
    console.log(data);
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
                <CustomEditor onChange={field.onChange} />
              </FormControl>
              <FormDescription>
                Đây là mô tả được hiển thị ở bên trong thư viện
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-center">
          <Button
            className="text-lg font-medium"
            size="lg"
            type="submit"
            variant="destructive"
            onClick={() => router.back()}
          >
            Hủy tác vụ
          </Button>
          <Button className="text-lg font-medium" size="lg" type="submit">
            Thêm
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormAddNewLibrary;