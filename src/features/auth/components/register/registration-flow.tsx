"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useValidateSignupLinkQuery } from "@/features/organizations/signup-link.api";
import UserTypeStep from "@/features/auth/components/register/user-type-step";
import RegistrationForm from "@/features/auth/components/register/registration-form";

export default function RegistrationFlow() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<"student" | "citizen" | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  const {
    data: validationData,
    isLoading: isValidating,
    error: validationError,
  } = useValidateSignupLinkQuery(token!, {
    skip: !token,
  });

  useEffect(() => {
    if (validationData?.data?.isValid) {
      handleUserTypeSelect("student");
      setOrganizationId(validationData.data.organizationId);
    }
  }, [validationData]);

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

  // Show loading state while validating token
  if (token && isValidating) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-primary/80 to-primary/90 dark:from-[#3a5a0e]/40 dark:to-[#3a5a0e]/50">
        <div className="flex flex-col items-center gap-4 text-white">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p>Đang xác thực link đăng ký...</p>
        </div>
      </main>
    );
  }

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
            <RegistrationForm
              userType={userType!}
              onBack={handlePrevStep}
              organizationId={organizationId}
              isValidLink={validationData?.data?.isValid}
            />
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
