"use client";
import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useAddNewOrganizationMutation } from "../organization.api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { useGetAllProvinceQuery } from "@/features/users/api/province.api";
import { Combobox } from "@/components/ui/comboBox";
type Props = {};

const formSchema = z.object({
  name: z.string().min(1, { message: "Đây là trường bắt buộc." }),
  name_7922188466: z.string().optional(),
  province_id: z.string().min(1, { message: "Đây là trường bắt buộc." }),
  name_1827310782: z.string().optional(),
});

function AddButton({}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { pronvinces } = useGetAllProvinceQuery(undefined, {
    selectFromResult: ({ data }) => ({
      pronvinces:
        data?.items.map((item: { name: string; _id: string }) => ({
          label: item?.name,
          value: item?._id,
        })) ?? [],
    }),
  });
  const [addOrganization, isFetching] = useAddNewOrganizationMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      delete values.name_1827310782;
      delete values.name_7922188466;
      let toastId = toast.loading("...Thêm tổ chức");

      try {
        await addOrganization(values);
        toast.success("Thêm tổ chức thành công", { id: toastId });
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

  return (
    <>
      {/* <Button onClick={() => form.reset()}>clear</Button> */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="ml-auto hidden lg:flex"
            onClick={() => form.reset()}
          >
            Thêm tổ chức
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader className="border-b pb-2">
            <DialogTitle>Thêm tổ chức</DialogTitle>
            {/* <DialogDescription>Thêm tổ chức ở đây</DialogDescription> */}
          </DialogHeader>
          <Form {...form}>
            <form
              className="space-y-4 max-w-3xl mx-2 py-4"
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
                name="name_7922188466"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pt-6">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" type="" {...field} />
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
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <FormField
                    control={form.control}
                    name="name_1827310782"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả</FormLabel>
                        <FormControl>
                          <Textarea
                            className="resize-none h-24"
                            placeholder=""
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-1 items-end justify-end">
                <Button className="" type="submit">
                  Tạo
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddButton;
