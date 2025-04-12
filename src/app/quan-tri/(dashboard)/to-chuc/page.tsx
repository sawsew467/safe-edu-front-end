import { Metadata } from "next";

import OrganizationsManagement from "@/features/organizations/components/organizations";

export const metadata: Metadata = {
  title: "Quản lý tổ chức",
};

export default function Page() {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <OrganizationsManagement />
    </div>
  );
}
