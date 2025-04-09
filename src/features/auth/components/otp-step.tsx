"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useVerifyOtpMutation } from "../api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type OtpFormValues, otpSchema } from "@/features/auth/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface OtpStepProps {
  phoneNumber: string;
  onSubmit: () => void;
  onBack: () => void;
  onResend: () => void;
}

export default function OtpStep({
  phoneNumber,
  onSubmit,
  onBack,
  onResend,
}: OtpStepProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    // Update form value when OTP changes
    const otpString = otp.join("");

    form.setValue("otp", otpString);
  }, [otp, form]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (data: OtpFormValues) => {
    setIsSubmitting(true);
    try {
      await verifyOtp({ phone_number: phoneNumber, otp: data.otp }).unwrap();
      toast.success("Xác nhận mã OTP thành công!");
      onSubmit();
    } catch (error) {
      toast.error("Mã OTP không hợp lệ, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTimer(60);
    onResend();
  };

  return (
    <Card className="w-full bg-white/95 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0">
      <CardHeader className="pb-4 pt-6">
        <div className="flex items-center">
          <Button size="icon" type="button" variant="ghost" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold text-center text-primary flex-1 mr-8">
            Nhập mã OTP
          </CardTitle>
        </div>

        <div className="flex justify-center mb-4">
          <img
            alt="Phone"
            className="max-h-32 w-auto"
            src="/images/auth/phone.png"
          />
        </div>

        <p className="text-center text-gray-600">
          Mã gồm 6 chữ số đã được gửi tới số{" "}
          <span className="font-medium text-primary">{phoneNumber}</span>
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
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <motion.input
                          key={index}
                          ref={(el) => {
                            if (el) {
                              inputRefs.current[index] = el;
                            }
                          }}
                          animate={{ opacity: 1, y: 0 }}
                          className="w-10 h-12 text-center text-xl font-bold border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary-50 shadow-sm"
                          initial={{ opacity: 0, y: 20 }}
                          maxLength={1}
                          transition={{ delay: index * 0.05 }}
                          type="text"
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-2 text-center" />
                </FormItem>
              )}
            />

            <div className="text-center">
              <p className="text-sm text-gray-500">
                {timer > 0 ? (
                  <>
                    Mã OTP sẽ hết hạn sau:{" "}
                    <span className="font-medium text-primary">{timer}s</span>
                  </>
                ) : (
                  <button
                    className="text-primary hover:underline font-medium"
                    onClick={handleResend}
                  >
                    Gửi lại OTP
                  </button>
                )}
              </p>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full"
                disabled={isSubmitting || otp.some((digit) => !digit)}
                type="submit"
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
