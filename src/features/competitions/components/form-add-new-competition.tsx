"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarDaysIcon } from "lucide-react";
import { vi } from "date-fns/locale/vi";
import { useRouter } from "next-nprogress-bar";
import { toast } from "sonner";

import { formSchema } from "../shema.competitions";
import { useAddNewCompetitionsMutation } from "../api.competitions";

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

const AddNewCompetitions = () => {
  const router = useRouter();
  const [addCompetition, { isLoading }] = useAddNewCompetitionsMutation();

  const handleRouterBack = () => {
    router.back();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = {
      ...values,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
    };

    const idToast = toast.loading("Đang thêm cuộc thi");

    try {
      await addCompetition(data).unwrap();
      toast.success("Thêm cuộc thi thành công", { id: idToast });
      handleRouterBack();
    } catch {
      toast.error("Thêm cuộc thi thất bại", { id: idToast });
    }
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
                  Đây là tiêu đề được hiển thị ở bên ngoài cuộc thi
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
          <h2>Khoảng thời gian diễn ra</h2>
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          className="flex-1 justify-start font-normal"
                          variant="outline"
                        >
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "Ngày bắt đầu"}
                          <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50 hover:opacity-100" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          required
                          locale={vi}
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date && date.getDate() >= new Date().getDate())
                              field.onChange(date);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          className="flex-1 justify-start font-normal"
                          disabled={!form.getValues("startDate")}
                          variant="outline"
                        >
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "Ngày kết thúc"}
                          <CalendarDaysIcon className="ml-auto h-4 w-4 opacity-50 hover:opacity-100" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          required
                          locale={vi}
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (!date) return;
                            if (
                              date < form.getValues("startDate") ||
                              date.getDate() < new Date().getDate()
                            )
                              return;
                            field.onChange(date);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>

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
            Hủy tác vụ
          </Button>
          <Button className="font-medium" isLoading={isLoading} type="submit">
            Thêm
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddNewCompetitions;
