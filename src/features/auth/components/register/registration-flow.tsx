"use client";

import { useState } from "react";

import UserTypeStep from "@/features/auth/components/register/user-type-step";
import RegistrationForm from "@/features/auth/components/register/registration-form";

export default function RegistrationFlow() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<"student" | "citizen" | null>(null);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleUserTypeSelect = (type: "student" | "citizen") => {
    setUserType(type);
    handleNextStep();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-primary/80 to-primary/90 dark:from-[#3a5a0e]/40 dark:to-[#3a5a0e]/50 relative overflow-hidden">
      <div className="w-full max-w-md mx-auto z-10">
        <div className="transition-all duration-500 transform">
          {step === 1 && (
            <UserTypeStep
              onBack={handlePrevStep}
              onSelect={handleUserTypeSelect}
            />
          )}
          {step === 2 && (
            <RegistrationForm userType={userType!} onBack={handlePrevStep} />
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-8 flex justify-center gap-2">
          {[1, 2].map((i) => (
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
