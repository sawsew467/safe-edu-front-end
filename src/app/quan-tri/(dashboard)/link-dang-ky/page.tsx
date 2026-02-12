import { Metadata } from "next";

import SignupLinksManagement from "@/features/organizations/components/signup-links-management";

export const metadata: Metadata = {
  title: "Quản lý link đăng ký",
};

export default function SignupLinksPage() {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <SignupLinksManagement />
    </div>
  );
}
