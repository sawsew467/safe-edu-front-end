"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

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

export type UserType = {
  achievements: String[];
  avatar: string;
  first_name: string;
  last_name: string;
  username: string;
};
function UserDropdown({ userInfo }: { userInfo: UserType }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    deleteClientCookie(constants.USER_INFO);
    deleteClientCookie(constants.ACCESS_TOKEN);
    deleteClientCookie(constants.REFRESH_TOKEN);

    window.location.reload();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-8 w-8 rounded-full" variant="ghost">
          <Avatar className="h-8 w-8">
            <AvatarImage
              alt={`${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`}
              src={userInfo?.avatar || ""}
            />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent forceMount align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {`${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userInfo?.username || ""}
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
          <button className="w-full text-left" onClick={handleSignOut}>
            Sign out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
