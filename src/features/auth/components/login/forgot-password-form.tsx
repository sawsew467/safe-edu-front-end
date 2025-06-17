"use client";

import { useRouter } from "next-nprogress-bar";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  ForgotPasswordFormValues,
  forgotPasswordSchema,
} from "@/features/auth/validation";
import { useForgotPasswordMutation } from "@/features/auth/api";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: { email: string }) => {
    try {
      const res = await forgotPassword(data).unwrap();

      router.replace("/xac-thuc-otp?email=" + data.email);
    } catch {
    } finally {
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-primary/80  to-primary/20 dark:from-[#3a5a0e]/40 dark:to-[#3a5a0e]/50 relative overflow-hidden">
      <Card className="w-full max-w-md bg-white/95 dark:bg-black/30 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0">
        <CardHeader className="pb-4 pt-6">
          <div className="flex justify-center mb-4">
            <Image
              alt="Forgot Password"
              className="max-h-32 w-auto"
              height={300}
              src="/images/auth/login.png"
              width={300}
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Quên mật khẩu
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-100">
            Nhập địa chỉ email của bạn, chúng tôi sẽ gửi mã xác minh để đặt lại
            mật khẩu
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-primary focus:border-green-500 focus:ring-green-500"
                        placeholder="your.email@example.com"
                      />
                    </FormControl>
                    <FormDescription>
                      Chúng tôi sẽ gửi mã xác minh qua email.
                    </FormDescription>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <Button
                className="w-full"
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
              >
                Gửi mã xác minh
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Nhớ lại mật khẩu?{" "}
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
