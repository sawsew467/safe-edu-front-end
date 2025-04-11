"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type PhoneNumberFormValues,
  phoneNumberSchema,
} from "@/features/auth/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface PhoneNumberStepProps {
  onSubmit: (phoneNumber: string) => void;
}

export default function PhoneNumberStep({ onSubmit }: PhoneNumberStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PhoneNumberFormValues>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const handleSubmit = async (data: PhoneNumberFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSubmit(data.phoneNumber);
    } catch (error) {
      console.error("Error submitting phone number:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full bg-white/95 dark:bg-black/30 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0">
      <CardHeader className="pb-4 pt-6">
        <div className="flex justify-center mb-4">
          <img
            alt="Phone"
            className="max-h-32 w-auto"
            src="/images/auth/phone.png"
          />
        </div>
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Bắt đầu
        </CardTitle>
        <p className="text-center text-gray-600 dark:text-gray-100">
          Hãy nhập số điện thoại để đăng ký tài khoản
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <div className="flex">
                    <div className="flex items-center justify-center bg-green-50 px-3 rounded-l-md border border-r-0 border-primary">
                      <span className="text-sm font-medium text-green-700">
                        +84
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-l-none border-primary focus:border-green-500 focus:ring-green-500"
                        maxLength={10}
                        placeholder="Nhập số điện thoại"
                        type="tel"
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");

                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Button className="w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Đang xử lý..." : "Tiếp tục"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
