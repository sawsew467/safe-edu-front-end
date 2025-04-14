"use client";
import React from "react";
import { toast } from "sonner";

import { useSignInMutation } from "../../api";

import OtpStep from "./otp-step";
import PhoneNumberStep from "./phone-number-step";
import LoginSuccess from "./login-success";

const LoginFlow = () => {
  const [step, setStep] = React.useState(1);
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [otp, setOtp] = React.useState<string | null>(null);

  const [sendOtp, { isLoading }] = useSignInMutation();
  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };
  const handleOtpSubmit = async (otp: string) => {
    setOtp(otp);
    handleNextStep();
  };

  const handlePhoneSubmit = async (phone: string) => {
    setPhoneNumber(phone);
    try {
      await sendOtp({ phone_number: phone }).unwrap();
      toast.success("Gửi mã OTP thành công!");
      setStep(2);
    } catch (error) {
      toast.error("Gửi mã OTP thất bại, vui lòng thử lại sau!");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-primary/80  to-primary/20 dark:from-[#3a5a0e]/40 dark:to-[#3a5a0e]/50 relative overflow-hidden">
      <div className="w-full relative max-w-md mx-auto z-10">
        <div className=" transition-all duration-500 transform">
          {step === 1 && <PhoneNumberStep onSubmit={handlePhoneSubmit} />}
          {step === 2 && (
            <OtpStep
              phoneNumber={phoneNumber}
              onBack={handlePrevStep}
              onResend={() => handlePhoneSubmit(phoneNumber)}
              onSubmit={handleOtpSubmit}
            />
          )}
          {step === 3 && <LoginSuccess />}
        </div>
      </div>
    </main>
  );
};

export default LoginFlow;
