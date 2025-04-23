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
  const access_token = cookiesStore.get(constants.ACCESS_TOKEN)?.value;

  if (access_token) redirect("/");

  return <div>{children}</div>;
}
