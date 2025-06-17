"use client";

import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next-nprogress-bar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type PhoneNumberFormValues } from "@/features/auth/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";

interface PhoneNumberStepProps {
  onSubmit: (data: { username: string; password: string }) => void;
  form: ReturnType<typeof useForm<PhoneNumberFormValues>>;
  isLoading: boolean;
}

export default function LoginForm({
  onSubmit,
  form,
  isLoading,
}: PhoneNumberStepProps) {
  const router = useRouter();
  const handleSubmit = async (data: PhoneNumberFormValues) => {
    try {
      onSubmit(data);
    } catch {
    } finally {
    }
  };

  return (
    <Card className="w-full bg-white/95 dark:bg-black/30 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0">
      <CardHeader className="pb-4 pt-6">
        <div className="flex justify-center mb-4">
          <Image
            alt="Phone"
            className="max-h-32 w-auto"
            height={300}
            src="/images/auth/login.png"
            width={300}
          />
        </div>
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Đăng nhập
        </CardTitle>
        <p className="text-center text-gray-600 dark:text-gray-100">
          Hãy nhập tên tài khoản và mật khẩu để đăng nhập
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên Tài Khoản</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-primary focus:border-green-500 focus:ring-green-500"
                      maxLength={50}
                      placeholder="Nhập tên tài khoản"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Mật khẩu</FormLabel>
                    <Link
                      className="text-sm text-primary hover:underline"
                      href="/quen-mat-khau"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      className="border-primary focus:border-green-500 focus:ring-green-500"
                      maxLength={50}
                      placeholder="Nhập mật khẩu"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm " />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Button
                className="w-full"
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
              >
                Đăng nhập
              </Button>
              <Button
                className="w-full"
                disabled={isLoading}
                type="button"
                variant="outline"
                onClick={() => router.replace("/dang-ky")}
              >
                Đăng ký
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
