"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useChangePasswordMutation } from "../../api/student.api";

import { ChangePasswordShema } from "@/features/auth/validation";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const ChangePassowordModule = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const form = useForm<z.infer<typeof ChangePasswordShema>>({
    mode: "onSubmit",
    resolver: zodResolver(ChangePasswordShema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });
  const handleSubmit = async (data: z.infer<typeof ChangePasswordShema>) => {
    const { confirm_password, ...passwordData } = data;
    const toastID = toast.loading("Đang thay đổi mật khẩu...");

    try {
      await changePassword(passwordData).unwrap();
      toast.success("Thay đổi mật khẩu thành công", { id: toastID });
    } catch (err: any) {
      const { message } = err?.data;

      form.setError("old_password", {
        message: message || "Mật khẩu cũ không đúng",
      });
      toast.error(message || "Thay đổi mật khẩu thất bại", {
        id: toastID,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="p-4 md:max-w-lg max-w-[375px] rounded-lg">
        <DialogTitle>Thay đổi mật khẩu</DialogTitle>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="old_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu cũ</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      className="border-primary focus:border-green-500 focus:ring-green-500"
                      maxLength={50}
                      placeholder="Nhập mật khẩu cũ"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm " />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      className="border-primary focus:border-green-500 focus:ring-green-500"
                      maxLength={50}
                      placeholder="Nhập mật khẩu mới"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm " />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận Mật khẩu</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      className="border-primary focus:border-green-500 focus:ring-green-500"
                      maxLength={50}
                      placeholder="Xác nhận mật khẩu mới"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm " />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                className="w-full"
                disabled={isLoading}
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Hủy
              </Button>
              <Button
                className="w-full"
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
              >
                Thay đổi mật khẩu
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassowordModule;
