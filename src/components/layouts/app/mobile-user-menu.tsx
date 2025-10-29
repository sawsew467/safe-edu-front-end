"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { User, FileText, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deleteAllClientCookie } from "@/lib/jsCookies";
import { useGetUserQuery } from "@/features/users/api/student.api";
import { Skeleton } from "@/components/ui/skeleton";

interface MobileUserMenuProps {
  onClose: () => void;
}

const itemVariants: Variants = {
  closed: {
    opacity: 0,
    x: -20,
  },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};

function MobileUserMenu({ onClose }: MobileUserMenuProps) {
  const router = useRouter();

  const { user, isSuccess } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isFetching, isSuccess }) => ({
      user: data?.data,
      isFetching,
      isSuccess,
    }),
  });

  const handleGetProfile = () => {
    router.push(`/trang-ca-nhan/${user?.username}`);
    onClose();
  };

  const handleGetMyReport = () => {
    router.push(`/phan-anh-cua-toi`);
    onClose();
  };

  const handleSignOut = () => {
    deleteAllClientCookie();
    onClose();
    window.location.reload();
  };

  if (isSuccess && !user) return null;

  const menuItems = [
    {
      icon: User,
      label: "Trang cá nhân",
      onClick: handleGetProfile,
    },
    {
      icon: FileText,
      label: "Phản ánh của tôi",
      onClick: handleGetMyReport,
    },
    {
      icon: LogOut,
      label: "Đăng xuất",
      onClick: handleSignOut,
    },
  ];

  return (
    <div className="border-t border-gray-200 pt-4">
      {/* User Info */}
      <motion.div
        animate="open"
        className="mb-4 flex items-center space-x-3 px-0"
        custom={0}
        initial="closed"
        variants={itemVariants}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage
            alt={`${user?.first_name || ""} ${user?.last_name || ""}`}
            className="object-cover"
            src={user?.avatar || ""}
          />
          <AvatarFallback>
            <Skeleton className="h-6 w-6 rounded-full" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 truncate">
          <p className="text-sm font-medium text-gray-900">
            {`${user?.first_name || ""} ${user?.last_name || ""}`}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.username || ""}
          </p>
        </div>
      </motion.div>

      {/* Menu Items */}
      <div className="space-y-1">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            animate="open"
            className="flex w-full items-center space-x-3 px-0 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            custom={index + 1}
            initial="closed"
            variants={itemVariants}
            onClick={item.onClick}
          >
            <item.icon className="h-5 w-5 text-gray-500" />
            <span>{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default MobileUserMenu;
