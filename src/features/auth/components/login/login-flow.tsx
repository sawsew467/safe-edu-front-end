"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useSignInMutation } from "../../api";
import { PhoneNumberFormValues, phoneNumberSchema } from "../../validation";
import { setAccessToken, setRefreshToken, setUserRole } from "../../slice";

import LoginForm from "./login-form";
import LoginSuccess from "./login-success";

import { useAppDispatch } from "@/hooks/redux-toolkit";

const LoginFlow = () => {
  const [step, setStep] = React.useState(1);
  const dispatch = useAppDispatch();
  const [signIn, { isLoading }] = useSignInMutation();
  const form = useForm<PhoneNumberFormValues>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const handlePhoneSubmit = async (data: {
    username: string;
    password: string;
  }) => {
    try {
      const res = await signIn(data).unwrap();

      dispatch(setUserRole(res?.data?.access_token));
      dispatch(setAccessToken(res?.data?.access_token));
      dispatch(setRefreshToken(res?.data?.refresh_token));
      setStep(2);
    } catch (error) {
      const message: string =
        (error as any)?.data?.error?.message || "Đã xảy ra lỗi!";
      const details: string =
        (error as any)?.data?.error?.details || "Đã xảy ra lỗi!";

      toast.error(message);

      if (details.includes("Username")) {
        form.setError("username", { message });
      } else if (details.includes("Password ")) {
        form.setError("password", { message });
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-primary/80  to-primary/20 dark:from-[#3a5a0e]/40 dark:to-[#3a5a0e]/50 relative overflow-hidden">
      <div className="w-full relative max-w-md mx-auto z-10">
        <div className=" transition-all duration-500 transform">
          {step === 1 && (
            <LoginForm
              form={form}
              isLoading={isLoading}
              onSubmit={handlePhoneSubmit}
            />
          )}
          {step === 2 && <LoginSuccess />}
        </div>
      </div>
    </main>
  );
};

export default LoginFlow;
