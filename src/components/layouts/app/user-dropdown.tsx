"use client";

import React, { useState } from "react";
import { useRouter } from "next-nprogress-bar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import constants from "@/settings/constants";
import { deleteClientCookie } from "@/lib/jsCookies";
import { useGetUserQuery } from "@/features/users/api/student.api";
import { Skeleton } from "@/components/ui/skeleton";

export type UserType = {
  achievements: String[];
  avatar: string;
  first_name: string;
  last_name: string;
  username: string;
};
function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { user, isFetching, isSuccess } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isFetching, isSuccess }) => ({
      user: data?.data,
      isFetching,
      isSuccess,
    }),
  });

  const handleGetProfile = () => {
    router.push(`/trang-ca-nhan/${user?.username}`);
  };
  const handleSignOut = () => {
    deleteClientCookie(constants.ACCESS_TOKEN);
    deleteClientCookie(constants.REFRESH_TOKEN);

    window.location.reload();
  };

  if (isSuccess && !user) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-8 w-8 rounded-full" variant="ghost">
          <Avatar className="h-8 w-8">
            <AvatarImage
              alt={`${user?.first_name || ""} ${user?.last_name || ""}`}
              className="object-cover"
              src={user?.avatar || ""}
            />
            <AvatarFallback>
              <Skeleton className="h-4 w-4 rounded-full" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent forceMount align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {`${user?.first_name || ""} ${user?.last_name || ""}`}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.username || ""}
            </p>
          </div>
        </DropdownMenuLabel>
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuItem>
          <Link className="w-full" href="/profile">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link className="w-full" href="/cv">
            CV Attachment
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link className="w-full" href="/settings">
            Settings
          </Link>
        </DropdownMenuItem> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem>
          <button className="w-full text-left" onClick={handleGetProfile}>
            Trang cá nhân
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button className="w-full text-left" onClick={handleSignOut}>
            Đăng xuất
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
