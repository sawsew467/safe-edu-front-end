"use client";
import React, { useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  useGetOrganizationQuery,
  useUpdateOrganizationMutation,
} from "../organization.api";

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
import { Input } from "@/components/ui/input";
import { useGetAllProvinceQuery } from "@/features/users/api/province.api";
import { Combobox } from "@/components/ui/comboBox";
import { Spinner } from "@/components/ui/spinner";
type Props = {};

const formSchema = z.object({
  name: z.string().min(1, { message: "Đây là trường bắt buộc." }),
  province_id: z.string().min(1, { message: "Đây là trường bắt buộc." }),
});

function FormEditOrganizations({
  setOpenDialog,
  id,
}: {
  setOpenDialog: (open: boolean) => void;
  id: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", province_id: "" },
  });

  const { organization, isFetching } = useGetOrganizationQuery(
    { id },
    {
      selectFromResult: ({ data, isFetching }) => ({
        organization: data
          ? {
              name: data?.name,
              province_id: data?.province_id?.[0]?._id,
            }
          : {},
        isFetching,
      }),
    },
  );

  const { pronvinces } = useGetAllProvinceQuery(undefined, {
    selectFromResult: ({ data }) => ({
      pronvinces:
        data?.items.map((item: { name: string; _id: string }) => ({
          label: item?.name,
          value: item?._id,
        })) ?? [],
    }),
  });
  const [editOrganization, { isLoading: isEditOrganizations }] =
    useUpdateOrganizationMutation();

  useEffect(() => {
    if (organization) {
      form.reset(organization);
    }
  }, [organization]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let toastId = toast.loading("...Chỉnh sửa tổ chức");

    try {
      await editOrganization({ params: { id }, body: values });
      toast.success("Chỉnh sửa tổ chức thành công", { id: toastId });
      handleBack();
    } catch (err) {
      toast.error("Chỉnh sửa tổ chức thất bại", { id: toastId });
    }
  }

  const handleBack = () => {
    setOpenDialog(false);
  };

  if (isFetching)
    return (
      <div className="flex w-full justify-center items-center h-30">
        <Spinner />
      </div>
    );

  return (
    <>
      <Form {...form}>
        <form
          className="space-y-4  mx-2 py-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Tên tổ chức</FormLabel>
                <FormControl>
                  <Input
                    className=""
                    placeholder="Tên tổ chức"
                    type="text"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="province_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tỉnh/Thành phố quan sát</FormLabel>
                <FormControl>
                  <Combobox
                    className="w-full"
                    options={pronvinces}
                    placeholder="Chọn Tỉnh/Thành phố"
                    value={field.value}
                    variant="outline"
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Chọn tỉnh thành quan sát của quan sát viên này.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-1 items-end gap-4 justify-center">
            <Button
              className=""
              type="button"
              variant="destructive"
              onClick={handleBack}
            >
              Hủy
            </Button>
            <Button className="" isLoading={isEditOrganizations} type="submit">
              Chỉnh sửa
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default FormEditOrganizations;
