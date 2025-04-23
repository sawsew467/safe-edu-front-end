"use client";
import React from "react";
import { Separator } from "@radix-ui/react-separator";

import { HeaderBreadcrumb } from "./header-breadcrumb";
import ThemeSwitcher from "./theme-switcher";
import UserDropdown from "./user-dropdown";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
const getScrollbarWidth = (): number => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return 0;
  }

  return window.innerWidth - document.documentElement.clientWidth;
};
const Header = () => {
  const isMobile = useIsMobile();
  const [scrollbarWidth, setScrollbarWidth] = React.useState(0);
  const [open, setIsOpen] = React.useState(true);

  React.useEffect(() => {
    const updateScrollbarWidth = () => setScrollbarWidth(getScrollbarWidth());

    updateScrollbarWidth();
    window.addEventListener("resize", updateScrollbarWidth);

    return () => window.removeEventListener("resize", updateScrollbarWidth);
  }, [open]);

  return (
    <>
      <AppSidebar setIsOpen={setIsOpen} />
      <SidebarInset>
        <header
          className={cn(
            "flex  dark:bg-sidebar/60 z-10 backdrop-blur-md h-16 shrink-0 items-center px-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 shadow-sm fixed right-0 bg-white/60",
          )}
          style={
            isMobile
              ? { width: "100%" }
              : {
                  width: open
                    ? `calc(100vw - 255px - ${scrollbarWidth}px)`
                    : `calc(100vw - 47px - ${scrollbarWidth}px)`,
                }
          }
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
            {/* <NotificationDropdown /> */}
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
    </>
  );
};

export default Header;
