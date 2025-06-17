"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useResetPasswordMutation } from "@/features/auth/api";
import {
  resetPasswordFormSchema,
  ResetPasswordFormValues,
} from "@/features/auth/validation";

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const router = useRouter();
  const searchParams = useSearchParams();
  const otp = searchParams.get("otp");

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const handleSubmit = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const res = await resetPassword({
        otp: otp,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
      router.replace("/dang-nhap");
    } catch (error: any) {
    } finally {
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-primary/80  to-primary/20 dark:from-[#3a5a0e]/40 dark:to-[#3a5a0e]/50 relative overflow-hidden">
      <Card className="w-full max-w-md bg-white/95 dark:bg-black/30 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Đặt lại mật khẩu
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-100">
            Hãy tạo một mật khẩu mới cho tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="pr-10"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {!showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ
                      thường và số.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="pr-10"
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {!showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full"
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
              >
                Đặt lại mật khẩu
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Đã nhớ mật khẩu?{" "}
            <Link
              className="text-primary font-medium hover:underline"
              href="/dang-nhap"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
