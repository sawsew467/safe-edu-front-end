"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/hooks/redux-toolkit";

const user = {
  fullName: "Jane Doe",
  imageUrl: "https://randomuser",
  emailAddresses: "thangtvb.dev@gmail.com",
};

function UserDropdown() {
  const router = useRouter();

  const { userInfo } = useAppSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    router.push("/dang-nhap");
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-8 w-8 rounded-full" variant="ghost">
          <Avatar className="h-8 w-8">
            <AvatarImage
              alt={`${userInfo?.firstname || ""} ${userInfo?.lastname || ""}`}
              src={userInfo?.avatarUrl}
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
              {`${userInfo?.firstname || ""} ${userInfo?.lastname || ""}`}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.emailAddresses}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
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
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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
