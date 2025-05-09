"use client";

import * as React from "react";
import {
  ChartPie,
  LibraryBig,
  Newspaper,
  Pyramid,
  School,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/utils/cn";
import { useAppSelector } from "@/hooks/redux-toolkit";

const sideBarItems = [
  {
    name: "Người dùng",
    url: "/nguoi-dung",
    icon: Users,
  },
  {
    name: "Thống kê",
    url: "/thong-ke",
    icon: ChartPie,
  },
  {
    name: "Tổ chức",
    url: "/to-chuc",
    icon: School,
  },
  {
    name: "Cuộc thi",
    url: "/cuoc-thi",
    icon: Pyramid,
  },
  {
    name: "Tin tức",
    url: "/tin-tuc",
    icon: Newspaper,
  },
  {
    name: "Thư viện",
    url: "/thu-vien",
    icon: LibraryBig,
  },
];

export function AppSidebar({
  setIsOpen,
  ...props
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  const pathname = usePathname();
  // const { isManager, isAdmin, isLoading, userId } = useRoles();
  const { userInfo } = useAppSelector((state) => state.auth);

  const rootPath = pathname?.split("/")?.[2];

  // const { manager } = useGetManagerQuery(userId, {
  //   skip: isLoading || !isManager,
  //   selectFromResult: ({ data }) => ({
  //     manager: data?.isActive ? data : {},
  //   }),
  // });

  React.useEffect(() => {
    setIsOpen(open);
  }, [open, setIsOpen]);

  // if (!isLoading && !isAdmin && !isManager) return <div />;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className=" ">
        <div
          className={cn(
            "flex gap-2 items-center transition-all",
            open ? "p-2" : "p-0",
          )}
        >
          <Image
            alt="logo"
            className="w-9 h-auto"
            height={100}
            src="/images/logo/logo.png"
            width={100}
          />
          {open && (
            // isManager ? (
            //   <h3 className="text-xl font-bold">
            //     {manager?.organizationId?.at(0)?.slug}
            //   </h3>
            // ) :
            <h3 className="text-xl font-bold">SafeEdu</h3>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sideBarItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    item.url === `/${rootPath}` && "bg-sidebar-accent",
                  )}
                >
                  <Link href={`/quan-tri${item.url}`}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
