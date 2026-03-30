"use client";
import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";

import { useGenerateAdminSignupLinkMutation } from "../signup-link.api";
import { SignupLink } from "../signup-link.types";

import SignupLinkQRView from "./signup-link-qr-view";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Combobox } from "@/components/ui/comboBox";
import { useGetAllOrganizationQuery } from "../organization.api";
import { Organization } from "../types";

type Props = {
  setOpenDialog: (open: boolean) => void;
  organizationId?: string;
};

const formSchema = z
  .object({
    organizationId: z.string().min(1, "Vui lòng chọn tổ chức"),
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

function FormGenerateSignupLinkAdmin({ setOpenDialog, organizationId }: Props) {
  const [generatedLink, setGeneratedLink] = useState<SignupLink | null>(null);
  const [generateLink, { isLoading }] = useGenerateAdminSignupLinkMutation();

  const { organizations }: { organizations: Array<{ label: string; value: string }> } =
    useGetAllOrganizationQuery(undefined, {
      selectFromResult: ({ data }) => ({
        organizations:
          data?.data?.items?.map((item: Organization) => ({
            label: item.name,
            value: item._id,
          })) ?? ([] as Array<{ label: string; value: string }>),
      }),
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationId: organizationId || "",
      startDate: new Date(),
      expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const toastId = toast.loading("Đang tạo link đăng ký...");
    try {
      const result = await generateLink({
        organizationId: values.organizationId,
        startDate: values.startDate.toISOString(),
        expirationDate: values.expirationDate.toISOString(),
      }).unwrap();

      toast.success("Tạo link đăng ký thành công", { id: toastId });
      setGeneratedLink(result.data);
    } catch (err: any) {
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
          name="organizationId"
          render={({ field }) => {
            const selectedOrg = organizations.find(
              (org: { label: string; value: string }) =>
                org.value === field.value,
            );
            return (
              <FormItem>
                <FormLabel>Tổ chức</FormLabel>
                <FormControl>
                  {organizationId ? (
                    <div className="flex w-full p-1 px-3 rounded-md border min-h-10 h-auto items-center bg-muted">
                      {selectedOrg?.label || "Đang tải..."}
                    </div>
                  ) : (
                    <Combobox
                      options={organizations}
                      placeholder="Chọn tổ chức"
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  )}
                </FormControl>
                <FormDescription>
                  Chọn tổ chức để tạo link đăng ký
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

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

export default FormGenerateSignupLinkAdmin;
