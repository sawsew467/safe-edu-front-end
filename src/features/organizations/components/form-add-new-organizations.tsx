"use client";
import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next-nprogress-bar";

import { useAddNewOrganizationMutation } from "../organization.api";

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
import { Combobox } from "@/components/ui/comboBox";
import { useGetProvincesQuery } from "@/features/auth/api";
type Props = {
  setOpenDialog: (open: boolean) => void;
};

const formSchema = z.object({
  name: z
    .string({ message: "Đây là trường bắt buộc." })
    .min(1, { message: "Đây là trường bắt buộc." }),
  province_id: z
    .string({ message: "Đây là trường bắt buộc." })
    .min(1, { message: "Đây là trường bắt buộc." }),
  slug: z
    .string()
    .min(3, "Slug phải có ít nhất 3 ký tự")
    .max(50, "Slug không được vượt quá 50 ký tự")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug chỉ được chứa chữ thường, số và dấu gạch ngang (-)",
    ),
});

function FormAddNewOrganizations({ setOpenDialog }: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { pronvinces } = useGetProvincesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      pronvinces:
        data?.data?.items?.map((item: { name: string; _id: string }) => ({
          label: item?.name,
          value: item?._id,
        })) ?? [],
    }),
  });
  const [addOrganization, { isLoading: isAddOrganizations }] =
    useAddNewOrganizationMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let toastId = toast.loading("...Thêm tổ chức");

      try {
        await addOrganization(values).unwrap();
        toast.success("Thêm tổ chức thành công", { id: toastId });
        handleBack();
      } catch (err) {
        toast.error("Thêm tổ chức thất bại", { id: toastId });
      }
      // toast(
      //   <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //     <code className="text-red-500">
      //       {JSON.stringify(values, null, 2)}
      //     </code>
      //   </pre>,
      // );
    } catch (error) {
      console.error("Form submission error", error);
      // toast.error("Failed to submit the form. Please try again.");
    }
  }

  const handleBack = () => {
    setOpenDialog(false);
  };

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
                <FormLabel>Tỉnh/Thành phố của tổ chức</FormLabel>
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
                  Chọn tỉnh thành nơi tổ chức thuộc về.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chuỗi định danh</FormLabel>
                <FormControl>
                  <Input
                    className=""
                    placeholder="Chuỗi định danh"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Đây là đường dẫn dẫn đến tổ chức, chỉ được chứa chữ, số và dấu
                  gạch ngang.
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
            <Button className="" isLoading={isAddOrganizations} type="submit">
              Tạo
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default FormAddNewOrganizations;
