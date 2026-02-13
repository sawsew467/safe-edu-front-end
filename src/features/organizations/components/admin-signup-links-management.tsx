"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { MoreHorizontal, Eye, XCircle, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  useGetActiveAdminSignupLinksQuery,
  useRevokeSignupLinkMutation,
} from "../signup-link.api";
import { OrganizationInfo, SignupLink } from "../signup-link.types";

import FormGenerateSignupLinkAdmin from "./form-generate-signup-link-admin";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CardList from "@/components/ui/data-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useBreadcrumb from "@/hooks/useBreadcrumb";

function AdminSignupLinksManagement() {
  const router = useRouter();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [linkToRevoke, setLinkToRevoke] = useState<SignupLink | null>(null);

  useBreadcrumb([
    {
      label: "Quản lý link đăng ký",
    },
  ]);

  const { signupLinks, isFetching, refetch } =
    useGetActiveAdminSignupLinksQuery(undefined, {
      selectFromResult: ({ data, isFetching }) => ({
        signupLinks: data?.data ?? [],
        isFetching,
      }),
    });
  const [revokeLink, { isLoading: isRevoking }] = useRevokeSignupLinkMutation();

  const handleViewDetail = (link: SignupLink) => {
    router.push(`/quan-tri/link-dang-ky/${link.id}`);
  };

  const handleRevokeClick = (link: SignupLink) => {
    setLinkToRevoke(link);
  };

  const handleConfirmRevoke = async () => {
    if (!linkToRevoke) return;

    try {
      const toastId = toast.loading("Đang thu hồi link...");
      await revokeLink(linkToRevoke.id).unwrap();
      toast.success("Thu hồi link thành công", { id: toastId });
      setLinkToRevoke(null);
      refetch();
    } catch (err) {
      toast.error("Thu hồi link thất bại");
    }
  };

  const columns = [
    {
      accessorKey: "organization_id",
      header: "Tổ chức",
      cell: ({ row }: any) => {
        const org = row.getValue("organization_id") as OrganizationInfo;
        return org?.name || "N/A";
      },
    },
    {
      accessorKey: "created_at",
      header: "Ngày tạo",
      cell: ({ row }: any) => {
        const date = new Date(row.getValue("created_at"));

        return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
      },
    },
    {
      accessorKey: "start_date",
      header: "Ngày bắt đầu",
      cell: ({ row }: any) => {
        const date = new Date(row.getValue("start_date"));

        return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
      },
    },
    {
      accessorKey: "expiration_date",
      header: "Ngày hết hạn",
      cell: ({ row }: any) => {
        const date = new Date(row.getValue("expiration_date"));

        return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
      },
    },
    {
      accessorKey: "is_revoked",
      header: "Trạng thái",
      cell: ({ row }: any) => {
        const isRevoked = row.getValue("is_revoked");

        return isRevoked ? (
          <span className="text-red-500 font-medium">Đã thu hồi</span>
        ) : (
          <span className="text-green-500 font-medium">Đang hoạt động</span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const link = row.original as SignupLink;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewDetail(link)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              {!link.is_revoked && (
                <DropdownMenuItem
                  onClick={() => handleRevokeClick(link)}
                  className="text-red-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Thu hồi link
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Quản lý link đăng ký</h3>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              Tạo link mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogTitle>Tạo link đăng ký mới</DialogTitle>
            <FormGenerateSignupLinkAdmin
              setOpenDialog={setIsCreateDialogOpen}
            />
          </DialogContent>
        </Dialog>
      </div>

      <CardList columns={columns} data={signupLinks} isLoading={isFetching} />

      {/* Revoke Confirmation Dialog */}
      <AlertDialog
        open={!!linkToRevoke}
        onOpenChange={(open) => !open && setLinkToRevoke(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thu hồi link</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thu hồi link này? Link sẽ không thể sử dụng
              để đăng ký sau khi bị thu hồi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevoking}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRevoke}
              disabled={isRevoking}
              className="bg-red-600 hover:bg-red-700"
            >
              {isRevoking ? "Đang thu hồi..." : "Thu hồi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default AdminSignupLinksManagement;
