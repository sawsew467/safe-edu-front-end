"use client";

import { useRouter } from "next-nprogress-bar";
import React, { useLayoutEffect } from "react";

import { getClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";
import { useAppSelector } from "@/hooks/redux-toolkit";

function AuthLayout({ children }: { children: React.ReactNode }) {
  const accessToken = getClientCookie(constants.ACCESS_TOKEN_ADMIN);

  const router = useRouter();

  const data = useAppSelector((state) => state.auth);

  console.log("🚀 ~ AuthLayout ~ data:", data);

  useLayoutEffect(() => {
    if (accessToken) {
      router.replace("/quan-tri/nguoi-dung");
    }
  }, [accessToken]);

  return <div>{children}</div>;
}

export default AuthLayout;
