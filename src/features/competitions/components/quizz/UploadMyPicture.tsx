import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAddNewPictureMutation } from "../../api.picture";

import UploadImage from "@/components/ui/upload-image";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z
    .string({ message: "Tên không được để trống" })
    .min(1, { message: "Tên không được để trống" }),
  description: z
    .string({ message: "Tên không được để trống" })
    .min(1, { message: "Mô tả không được để trống" }),
  picture: z
    .string({ message: "Tên không được để trống" })
    .min(1, { message: "Ảnh bìa không được để trống" }),
});

const UploadMyPicture = ({
  isOpen,
  setOpen,
  quiz_id,
}: {
  isOpen: boolean;
  quiz_id: string;
  setOpen: (open: boolean) => void;
}) => {
  const [uploadPicture, { isLoading }] = useAddNewPictureMutation();

  const handleRouterBack = () => {
    setOpen(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const idToast = toast.loading("Đang thêm cuộc thi");

    try {
      await uploadPicture({ ...values, quiz_id }).unwrap();
      toast.success("Thêm tranh thành công", { id: idToast });
      handleRouterBack();
    } catch {
      toast.error("Thêm tranh thất bại", { id: idToast });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Thêm tranh vẽ</DialogTitle>
        <Form {...form}>
          <form
            className="space-y-8 flex flex-col"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Tên bức tranh</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề" {...field} />
                    </FormControl>
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
                      <Textarea placeholder="Nhập mô tả" {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="picture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tranh vẽ</FormLabel>
                  <FormControl>
                    <UploadImage maxHeight={150} {...field} />
                  </FormControl>
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
                Hủy
              </Button>
              <Button
                className="font-medium"
                isLoading={isLoading}
                type="submit"
              >
                Nộp tranh
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadMyPicture;
