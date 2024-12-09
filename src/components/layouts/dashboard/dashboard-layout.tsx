"use client";

import { useState } from "react";

import HeaderBreadcrumb from "./header-breadcrumb";
import ThemeSwitcher from "./theme-switcher";
import UserDropdown from "./user-dropdown";
import NotificationDropdown from "./notification-dropdown";

import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/utils/cn";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setIsOpen] = useState(true);

  return (
    <SidebarProvider>
      <AppSidebar setIsOpen={setIsOpen} />
      <SidebarInset>
        <header
          className={cn(
            "flex dark:bg-sidebar/60 z-10 backdrop-blur-md h-16 shrink-0 items-center px-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 shadow-sm fixed right-0 bg-white/60",
            open ? "w-[calc(100vw-272px)]" : "w-[calc(100vw-64px)]",
          )}
        >
          <div className="flex items-center gap-2 justify-between w-full">
            <div className="flex items-center">
              <SidebarTrigger className="-ml-1" />
              <Separator className="mr-2 h-4" orientation="vertical" />
              <HeaderBreadcrumb />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <NotificationDropdown />
            <UserDropdown />
          </div>
        </header>
        <div
          className={cn(
            "flex flex-1 flex-col gap-4 p-4 dark:bg-foreground/30  bg-[#e2e6dc] transition-all overflow-auto",
            open ? "mt-16" : "mt-12",
          )}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
