import { Metadata } from "next";

import SignupLinkDetail from "@/features/organizations/components/signup-link-detail";

export const metadata: Metadata = {
  title: "Chi tiết link đăng ký",
};

export default function SignupLinkDetailPage() {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <SignupLinkDetail />
    </div>
  );
}
