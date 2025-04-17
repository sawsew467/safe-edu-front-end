"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next-nprogress-bar";

import {
  type UserTypeFormValues,
  userTypeSchema,
} from "@/features/auth/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserTypeStepProps {
  onSelect: (type: "student" | "citizen") => void;
  onBack: () => void;
}

export default function UserTypeStep({ onSelect, onBack }: UserTypeStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<UserTypeFormValues>({
    resolver: zodResolver(userTypeSchema),
    defaultValues: {
      userType: undefined,
    },
  });

  const handleSubmit = async (data: UserTypeFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSelect(data.userType);
    } catch (error) {
      console.error("Error submitting user type:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full bg-white/95 dark:bg-black/30 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0">
      <CardHeader className="pb-4 pt-6">
        <div className="flex items-center">
          <CardTitle className="text-2xl font-bold text-center text-primary flex-1 mr-8">
            Bạn là ai?
          </CardTitle>
        </div>
        <p className="text-center text-gray-600 mt-2">
          Hãy chọn vai trò phù hợp nhất
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
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all duration-200 ${
                          field.value === "student"
                            ? "border-primary bg-primary/10 dark:bg-[#3a5a0e]"
                            : "border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                        }`}
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => form.setValue("userType", "student")}
                      >
                        <div className="w-24 h-24 flex items-center justify-center mb-3 relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-full opacity-70" />
                          <img
                            alt="Học sinh"
                            className="w-16 h-16 relative z-10 object-contain"
                            src="/images/auth/student.png"
                          />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          Học sinh
                        </span>
                      </motion.button>

                      <motion.button
                        className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all duration-200 ${
                          field.value === "citizen"
                            ? "border-primary bg-primary/10 dark:bg-[#3a5a0e]"
                            : "border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                        }`}
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => form.setValue("userType", "citizen")}
                      >
                        <div className="w-24 h-24 flex items-center justify-center mb-3 relative">
                          <div className="absolute inset-0 bg-primary/20 rounded-full opacity-70" />
                          <img
                            alt="Người dân"
                            className="w-16 h-16 relative z-10 object-contain"
                            src="/images/auth/citizen.png"
                          />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          Người dân
                        </span>
                      </motion.button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-2 text-center" />
                </FormItem>
              )}
            />
            <div className="space-y-3">
              <Button
                className="w-full"
                disabled={isSubmitting || !form.watch("userType")}
                type="submit"
              >
                {isSubmitting ? "Đang xử lý..." : "Tiếp tục"}
              </Button>
              <Button
                className="w-full"
                disabled={isSubmitting}
                type="button"
                variant="outline"
                onClick={() => router.replace("/dang-nhap")}
              >
                Quay lại đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
