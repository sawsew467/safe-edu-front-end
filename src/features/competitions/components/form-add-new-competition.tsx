"use client";
import { useRouter } from "next-nprogress-bar";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { formSchema } from "../shema.competitions";

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
import { Combobox } from "@/components/ui/comboBox";
import { useGetAllOrganizationQuery } from "@/features/organizations/organization.api";
import { Organization } from "@/features/organizations/types";

const AddNewCompetitions = () => {
  const router = useRouter();
  const handleRouterBack = () => {
    router.replace("..");
  };

  const { organizations, isFetchingOrganizations } = useGetAllOrganizationQuery(
    undefined,
    {
      selectFromResult: ({ data, isFetching }) => ({
        organizations:
          data?.items
            ?.filter((item: Organization) => item?.isActive)
            ?.map((item: Organization) => ({
              label: item?.name,
              value: item?._id,
            })) ?? [],
        isFetchingOrganizations: isFetching,
      }),
    },
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  console.log("organizations", organizations);
  const onSubmit = (data: z.infer<typeof formSchema>) => {};

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
          name="organizations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tổ chức</FormLabel>
              <FormControl>
                <Combobox
                  className="w-full"
                  options={organizations}
                  placeholder="Chọn tổ chức"
                  value={field.value}
                  variant="outline"
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Đây là tổ chức chịu trách nhiệm và tổ chức cuộc thi.
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
            type="button"
            variant="destructive"
            onClick={handleRouterBack}
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

export default AddNewCompetitions;
