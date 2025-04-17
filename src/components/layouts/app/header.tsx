import Link from "next/link";
import React from "react";
import Image from "next/image";
import { cookies } from "next/headers";

import UserDropdown, { UserType } from "./user-dropdown";

import ThemeSwitcher from "@/components/layouts/dashboard/theme-switcher";
import { Button } from "@/components/ui/button";

async function AppHeader() {
  const cookiesStore = await cookies();
  const user_info = cookiesStore.get("_user_info");
  const userInfo = user_info ? JSON.parse(user_info.value) : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between m-auto px-4">
        <Link href={"/"}>
          <div className="flex items-center gap-2">
            <Image
              alt="logo"
              className="w-9 h-auto"
              height={100}
              src="/images/logo/logo.png"
              width={100}
            />
            <span className="text-xl font-bold">SafeEdu</span>
          </div>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link
            className="text-sm font-medium hover:text-[#8BC34A]"
            href="/tin-tuc"
          >
            Tin tức
          </Link>
          <Link
            className="text-sm font-medium hover:text-[#8BC34A]"
            href="/thu-vien"
          >
            Thư viện
          </Link>
          <Link
            className="text-sm font-medium hover:text-[#8BC34A]"
            href="/cuoc-thi"
          >
            Cuộc thi
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          {userInfo ? (
            <UserDropdown userInfo={userInfo as UserType} />
          ) : (
            <>
              <Link href="/dang-nhap">
                <Button variant="outline">Đăng nhập</Button>
              </Link>
              <Link href="/dang-ky">
                <Button variant="default">Đăng ký</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
