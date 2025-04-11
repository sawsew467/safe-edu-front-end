"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useSendOtpMutation } from "../../api";

import PhoneNumberStep from "@/features/auth/components/register/phone-number-step";
import OtpStep from "@/features/auth/components/register/otp-step";
import UserTypeStep from "@/features/auth/components/register/user-type-step";
import RegistrationForm from "@/features/auth/components/register/registration-form";

export default function RegistrationFlow() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userType, setUserType] = useState<"student" | "citizen" | null>(null);
  const [otp, setOtp] = useState<string | null>(null);
  const [sendOtp, { isLoading }] = useSendOtpMutation();

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
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

  const handleOtpSubmit = async (otp: string) => {
    setOtp(otp);
    handleNextStep();
  };

  const handleUserTypeSelect = (type: "student" | "citizen") => {
    setUserType(type);
    handleNextStep();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-primary/80 to-primary/90 dark:from-[#3a5a0e]/40 dark:to-[#3a5a0e]/50 relative overflow-hidden">
      <div className="w-full max-w-md mx-auto z-10">
        <div className="transition-all duration-500 transform">
          {step === 1 && <PhoneNumberStep onSubmit={handlePhoneSubmit} />}
          {step === 2 && (
            <OtpStep
              phoneNumber={phoneNumber}
              onBack={handlePrevStep}
              onResend={() => handlePhoneSubmit(phoneNumber)}
              onSubmit={handleOtpSubmit}
            />
          )}
          {step === 3 && (
            <UserTypeStep
              onBack={handlePrevStep}
              onSelect={handleUserTypeSelect}
            />
          )}
          {step === 4 && (
            <RegistrationForm
              otp={otp}
              phoneNumber={phoneNumber}
              userType={userType!}
              onBack={handlePrevStep}
            />
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-8 flex justify-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-8 bg-white dark:bg-black"
                  : i < step
                    ? "bg-white/80 dark:bg-black/80"
                    : "bg-white/30 dark:bg-black/30"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
