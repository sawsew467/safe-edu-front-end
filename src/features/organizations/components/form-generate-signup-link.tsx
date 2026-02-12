"use client";
import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";

import { useGenerateSignupLinkMutation } from "../signup-link.api";
import { SignupLink } from "../signup-link.types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FutureDatePicker } from "@/components/shared/future-date-picker";
import SignupLinkQRView from "./signup-link-qr-view";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

type Props = {
  setOpenDialog: (open: boolean) => void;
};

const formSchema = z
  .object({
    startDate: z.date({
      required_error: "Ngày bắt đầu là trường bắt buộc.",
    }),
    expirationDate: z.date({
      required_error: "Ngày hết hạn là trường bắt buộc.",
    }),
  })
  .refine((data) => data.expirationDate > data.startDate, {
    message: "Ngày hết hạn phải sau ngày bắt đầu",
    path: ["expirationDate"],
  });

function FormGenerateSignupLink({ setOpenDialog }: Props) {
  const [generatedLink, setGeneratedLink] = useState<SignupLink | null>(null);
  const [generateLink, { isLoading }] = useGenerateSignupLinkMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: new Date(),
      expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const toastId = toast.loading("Đang tạo link đăng ký...");
    try {
      const result = await generateLink({
        startDate: values.startDate.toISOString(),
        expirationDate: values.expirationDate.toISOString(),
      }).unwrap();

      toast.success("Tạo link đăng ký thành công", { id: toastId });
      setGeneratedLink(result.data);
    } catch (err: any) {
      console.log("err", err);
      const message = err?.data?.message;
      toast.error(message || "Tạo link đăng ký thất bại", { id: toastId });
    }
  }

  const handleBack = () => {
    setOpenDialog(false);
    setGeneratedLink(null);
  };

  if (generatedLink) {
    return (
      <SignupLinkQRView
        link={generatedLink}
        onClose={handleBack}
        showCloseButton
      />
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-4 py-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày bắt đầu</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
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
              </FormControl>
              <FormDescription>Ngày link bắt đầu có hiệu lực</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expirationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày hết hạn</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                        variant={"outline"}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày hết hạn</span>
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
              </FormControl>
              <FormDescription>Ngày link hết hiệu lực</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang tạo..." : "Tạo link"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default FormGenerateSignupLink;
