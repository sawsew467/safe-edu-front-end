"use client";
import React, { useEffect } from "react";
import { useRouter } from "next-nprogress-bar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { formLibrarySchema } from "../library.schema";
import { useGetLibraryQuery, useUpdateLibraryMutation } from "../api";

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
  description: "<p></p>",
  topic_id: "",
};
const FormUpdateLibrary = ({ id }: { id: string }) => {
  const router = useRouter();
  const [topics, setTopics] = React.useState<
    Array<{ label: string; value: string }>
  >([]);
  const { data: library } = useGetLibraryQuery({ id });
  const [addTopic] = useAddNewTopicMutation();
  const [updateLibrary, { isLoading }] = useUpdateLibraryMutation();
  const [deleteTopic] = useDeleteTopicMutation();
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

  const form = useForm<z.infer<typeof formLibrarySchema>>({
    resolver: zodResolver(formLibrarySchema),
    mode: "onSubmit",
    defaultValues: initialLibrary,
  });

  useEffect(() => {
    form.reset({
      category_name: library?.category_name,
      image: library?.image,
      description: library?.description,
      topic_id: library?.topic_id,
    });
  }, [library]);
  console.log("first", form.getValues("topic_id"));

  React.useEffect(() => {
    if (dataTopic) {
      setTopics(dataTopic);
    }
  }, [dataTopic]);

  const handleRouterBack = () => {
    router.back();
  };

  const handleDeleteTopic = async (id: string) => {
    if (id === form.getValues("topic_id")) {
      toast.error("Không thể xóa chủ đề đang chọn");

      return;
    }
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
      await updateLibrary({ params: { id }, body: newLibrary }).unwrap();
      toast.success("Thay đổi nội dung thư viện thành công");
    } catch (err) {}
  };

  return (
    <Form {...form}>
      <form
        className="space-y-8 flex flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="category_name"
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
          name="topic_id"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Chủ đề</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={(e) => {
                    if (e) field.onChange(e);
                  }}
                  {...field}
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
            </>
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
                <CustomEditor content={field.value} onChange={field.onChange} />
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
            type="button"
            variant="destructive"
            onClick={handleRouterBack}
          >
            Hủy tác vụ
          </Button>
          <Button className="font-medium" isLoading={isLoading} type="submit">
            Thay đổi
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormUpdateLibrary;
