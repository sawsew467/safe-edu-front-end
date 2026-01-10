import { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login/admin-login-form";

// Force dynamic rendering to avoid Firebase initialization at build time
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Đăng nhập",
};

function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}

export default Page;
