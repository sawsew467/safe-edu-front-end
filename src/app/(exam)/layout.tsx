import type { Metadata } from "next";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import constants from "@/settings/constants";

export const metadata: Metadata = {
  title: {
    template: "%s | SafeEdu",
    default: "SafeEdu",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies();
  const user_info = cookiesStore.get(constants.USER_INFO)?.value;

  if (!user_info) redirect("/dang-nhap");

  return <div>{children}</div>;
}
