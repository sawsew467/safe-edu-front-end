import { ChevronRight, Home } from "lucide-react";

import { BreadcrumbItemInterface } from "./slice";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-toolkit";
import { setCurrentOrganization } from "@/features/auth/slice";

interface BreadcrumbProps {
  items: BreadcrumbItemInterface[];
}

export function HeaderBreadcrumb({ items }: BreadcrumbProps) {
  const { current_organization, organization_list } = useAppSelector(
    (state) => state.auth
  );

  const dispatch = useAppDispatch();

  const handleChangeOrganization = (organization: any) => {
    dispatch(setCurrentOrganization(organization));
    window.location.reload();
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {!current_organization?.name && (
          <BreadcrumbItem>
            <BreadcrumbLink className="flex items-center" href="/quan-tri">
              <Home className="h-4 w-4 mr-2" />
              {"Trang chủ"}
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
        {current_organization?.name && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              {current_organization?.name}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Tổ chức đang quản lý</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {organization_list?.map((organization) => (
                <DropdownMenuItem
                  key={organization.id}
                  onClick={() => handleChangeOrganization(organization)}
                >
                  {organization.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        {items.map((item, index) => (
          <BreadcrumbItem key={item.href ?? index}>
            {index === items.length - 1 ? (
              <BreadcrumbPage className="max-w-80 truncate">
                {item.label}
              </BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink className="max-w-80 truncate" href={item.href}>
                  {item.label}
                </BreadcrumbLink>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
