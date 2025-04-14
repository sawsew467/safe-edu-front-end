"use client";
import { useRouter } from "next-nprogress-bar";
import { useLayoutEffect } from "react";

import AppFooter from "./footer";
import AppHeader from "./header";

import { useAppSelector } from "@/hooks/redux-toolkit";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { userInfo } = useAppSelector((state) => state.auth);

  const router = useRouter();

  useLayoutEffect(() => {
    if (!userInfo) {
      router.replace("/dang-nhap");
    }
  }, [userInfo]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}
