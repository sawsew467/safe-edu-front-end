"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { formSchema } from "../shema.competitions";
import {
  useGetCompetitionsQuery,
  useUpdateCompetitionsMutation,
} from "../api.competitions";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UploadImage from "@/components/ui/upload-image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const UpdateCompetitions = ({ competitionId }: { competitionId: string }) => {
  const [updateCompetition, { isLoading }] = useUpdateCompetitionsMutation();

  const { competition, isFetching } = useGetCompetitionsQuery(
    { id: competitionId },
    {
      selectFromResult: ({ data, isFetching }) => {
        return {
          competition: data?.data,
          isFetching,
        };
      },
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const handleRouterBack = () => {
    form.setValue("title", competition?.title);
    form.setValue("description", competition?.description);
    form.setValue("startDate", new Date(competition?.startDate));
    form.setValue("endDate", new Date(competition?.endDate));
    form.setValue("image_url", competition?.image_url);
    form.setValue("slug", competition?.slug);
  };

  useEffect(() => {
    if (competition) {
      form.setValue("title", competition?.title);
      form.setValue("description", competition?.description);
      form.setValue("startDate", new Date(competition?.startDate));
      form.setValue("endDate", new Date(competition?.endDate));
      form.setValue("image_url", competition?.image_url);
      form.setValue("slug", competition?.slug);
    }
  }, [competition]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = {
      ...values,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
    };

    const idToast = toast.loading("Đang thay đổi cuộc thi");

    try {
      await updateCompetition({
        params: { id: competitionId },
        body: data,
      }).unwrap();
      toast.success("Thay đổi cuộc thi thành công", { id: idToast });
    } catch {
      toast.error("Thay đổi cuộc thi thất bại", { id: idToast });
    }
  };

  if (isFetching)
    return (
      <div className="flex w-full justify-center items-center h-30">
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
                  <Input placeholder="nhập tiêu đề" {...field} />
                </FormControl>
                <FormDescription>
                  Đây là tiêu đề được hiển thị ở bên ngoài tin tức
                </FormDescription>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Input placeholder="nhập mô tả" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <div className="space-y-2">
          <p className="text-sm">Thời gian diễn ra</p>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          variant={"outline"}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày bắt đầu</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        initialFocus
                        disabled={(date) => date < new Date("1900-01-01")}
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          variant={"outline"}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày kết thúc</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        initialFocus
                        disabled={(date) => {
                          const startDate = form.getValues("startDate");

                          // Disable dates before start date (if start date is selected)
                          return startDate
                            ? date < startDate
                            : date < new Date("1900-01-01");
                        }}
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormDescription>
            Đây là Khoảng thời gian diễn ra cuộc thi
          </FormDescription>
        </div>
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Mã định danh</FormLabel>
                <FormControl>
                  <Input placeholder="nhập mã định danh" {...field} />
                </FormControl>
                <FormDescription>
                  Đây là mã định danh dẫn đén cuộc thi
                </FormDescription>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ảnh Bìa</FormLabel>
              <FormControl>
                <UploadImage {...field} />
              </FormControl>
              <FormDescription>
                Đây là tấm ảnh tượng trưng của cuộc thi
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-center">
          <Button
            className="font-medium"
            isLoading={isLoading}
            type="button"
            variant="destructive"
            onClick={handleRouterBack}
          >
            Hoàn tác
          </Button>
          <Button className="font-medium" isLoading={isLoading} type="submit">
            Thay đổi
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateCompetitions;
