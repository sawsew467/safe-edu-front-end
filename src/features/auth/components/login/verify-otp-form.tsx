"use client";

import { useState, useEffect } from "react";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

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
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useForgotPasswordMutation,
  useVerifyOtpForgotPasswordMutation,
} from "@/features/auth/api";
import {
  verifyOtpFormSchema,
  VerifyOtpFormValues,
} from "@/features/auth/validation";

export default function VerifyOtpForm() {
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [verifyOtpForgotPassword, { isLoading }] =
    useVerifyOtpForgotPasswordMutation();
  const [forgotPassword, { isLoading: isResending }] =
    useForgotPasswordMutation();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(60);
    }

    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleSubmit = async (data: { otp: string }) => {
    try {
      const res = await verifyOtpForgotPassword({
        email: email,
        otp: data.otp,
      }).unwrap();

      router.replace("/dat-lai-mat-khau?otp=" + data.otp);
    } catch (error: any) {
    } finally {
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await forgotPassword({ email }).unwrap();
      setResendDisabled(true);
      setCountdown(60);
    } catch (error) {}
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-primary/80  to-primary/20 dark:from-[#3a5a0e]/40 dark:to-[#3a5a0e]/50 relative overflow-hidden">
      <Card className="w-full max-w-md bg-white/95 dark:bg-black/30 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Xác minh Email
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-100">
            Nhập mã xác minh đã gửi đến <strong>vana.dev@gmail.com</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã xác minh</FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot
                              className="w-14 h-14 text-xl"
                              index={0}
                            />
                            <InputOTPSlot
                              className="w-14 h-14 text-xl"
                              index={1}
                            />
                            <InputOTPSlot
                              className="w-14 h-14 text-xl"
                              index={2}
                            />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot
                              className="w-14 h-14 text-xl"
                              index={3}
                            />
                            <InputOTPSlot
                              className="w-14 h-14 text-xl"
                              index={4}
                            />
                            <InputOTPSlot
                              className="w-14 h-14 text-xl"
                              index={5}
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Kiểm tra hộp thư để lấy mã 6 chữ số.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Button
                  className="w-full"
                  disabled={isLoading}
                  isLoading={isLoading}
                  type="submit"
                >
                  Xác minh mã
                </Button>

                <div className="text-center">
                  <Button
                    className="text-sm"
                    disabled={resendDisabled || isResending}
                    type="button"
                    variant="ghost"
                    onClick={handleResend}
                  >
                    {resendDisabled
                      ? `Gửi lại mã sau ${countdown}s`
                      : isResending
                        ? "Đang gửi lại..."
                        : "Không nhận được mã? Gửi lại"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            <Link
              className="text-primary font-medium hover:underline"
              href="/quen-mat-khau"
            >
              Dùng email khác
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
