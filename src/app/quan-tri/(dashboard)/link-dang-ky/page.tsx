"use client";
import SignupLinksManagement from "@/features/organizations/components/signup-links-management";
import AdminSignupLinksManagement from "@/features/organizations/components/admin-signup-links-management";
import { useAppSelector } from "@/hooks/redux-toolkit";

export default function SignupLinksPage() {
  const { current_organization } = useAppSelector((state) => state.auth);

  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      {current_organization ? (
        <SignupLinksManagement />
      ) : (
        <AdminSignupLinksManagement />
      )}
    </div>
  );
}
