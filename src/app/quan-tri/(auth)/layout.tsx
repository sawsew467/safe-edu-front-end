"use client";

import { useRouter } from "next-nprogress-bar";
import React, { useLayoutEffect } from "react";

import { getClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";
import { useAppSelector } from "@/hooks/redux-toolkit";

function AuthLayout({ children }: { children: React.ReactNode }) {
  const accessToken = getClientCookie(constants.ACCESS_TOKEN_ADMIN);

  const router = useRouter();

  const { current_organization } = useAppSelector((state) => state.auth);

  useLayoutEffect(() => {
    if (accessToken) {
      if (current_organization === null) router.replace("/quan-tri/nguoi-dung");
      else router.replace(`/quan-tri/to-chuc/${current_organization.id}`);
    }
  }, [accessToken]);

  return <div>{children}</div>;
}

export default AuthLayout;
