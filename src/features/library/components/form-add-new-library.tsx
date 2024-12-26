"use client";
import React, { useState } from "react";
import { useRouter } from "next-nprogress-bar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { formLibrarySchema } from "../library.schema";
import { useAddNewLibraryMutation } from "../api";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/topic-select";
import {
  useAddNewTopicMutation,
  useDeleteTopicMutation,
  useGetAllTopicQuery,
} from "@/features/topic/api";
const initialLibrary = {
  category_name: "",
  image: "",
  description: "",
  topic_id: "",
};
const FormAddNewLibrary = () => {
  const [topics, setTopics] = useState<Array<{ label: string; value: string }>>(
    [],
  );
  const router = useRouter();

  const form = useForm<z.infer<typeof formLibrarySchema>>({
    resolver: zodResolver(formLibrarySchema),
    mode: "onSubmit",
    defaultValues: initialLibrary,
  });
  const { dataTopic } = useGetAllTopicQuery(undefined, {
    selectFromResult: ({ data: topic }) => {
      const data = topic?.data?.filter((topic) => topic.isActive) ?? [];

      return {
        dataTopic: data?.map((topic) => ({
          value: topic._id,
          label: topic.topic_name,
        })),
      };
    },
  });
  const [addTopic] = useAddNewTopicMutation();
  const [deleteTopic] = useDeleteTopicMutation();
  const [addNewLibrary] = useAddNewLibraryMutation();

  React.useEffect(() => {
    if (dataTopic) {
      setTopics(dataTopic);
    }
  }, [dataTopic]);

  const handleDeleteTopic = async (id: string) => {
    try {
      await deleteTopic({ id }).unwrap();
      setTopics((prev) => prev.filter((item) => item.value !== id));
    } catch (err) {}
  };
  const handleAddNewTopic = async (topic_name: string) => {
    const newTopic = await addTopic({
      topic_name,
      description: topic_name,
    });

    setTopics((prev) => [
      ...prev,
      { label: newTopic?.data?.topic_name, value: newTopic?.data?._id },
    ]);
  };

  const onSubmit = async (data: z.infer<typeof formLibrarySchema>) => {
    const newLibrary = {
      ...data,
      category_name: data?.category_name?.replaceAll('"', '\"'),
    };

    try {
      await addNewLibrary(newLibrary).unwrap();
      toast.success("Thêm thư viện thành công");
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <Form {...form}>
      <form className="w-2/3 space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="category_name"
          render={({ field }) => (
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
          )}
        />
        <FormField
          control={form.control}
          name="topic_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chủ đề</FormLabel>
              <Select
                {...field}
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chủ đề" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent isAddItem onAddItem={handleAddNewTopic}>
                  {topics.map(({ label, value }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      onDeleteItem={handleDeleteTopic}
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Đây là chủ đề của bài viết được nói đến
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <UploadImage {...field} />
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <CustomEditor {...field} />
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
            className="font-medium"
            variant="destructive"
            onClick={() => router.back()}
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

export default FormAddNewLibrary;
