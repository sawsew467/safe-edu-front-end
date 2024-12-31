"use client";
import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { provinces } from "@/features/organizations/data";
type Props = {};

const formSchema = z.object({
  name_7502870039: z.string(),
  name_7922188466: z.string(),
  name_5438378062: z.string(),
  name_1827310782: z.string(),
});

function AddButton({}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
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
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto hidden lg:flex" type="submit">
          Submit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="border-b pb-2">
          <DialogTitle>Thêm tổ chức</DialogTitle>
          {/* <DialogDescription>Thêm tổ chức ở đây</DialogDescription> */}
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4 max-w-3xl mx-auto py-10"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name_7502870039"
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
              name="name_5438378062"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tỉnh Thành</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      {/* <FormControl> */}
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tỉnh thành" />
                      </SelectTrigger>
                      {/* </FormControl> */}
                      <SelectContent>
                        {provinces.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name="name_1827310782"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          className="resize-none"
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
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddButton;
