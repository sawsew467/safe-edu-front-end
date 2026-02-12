"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, XCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import {
  useGetSignupLinkByIdQuery,
  useRevokeSignupLinkMutation,
} from "../signup-link.api";

import SignupLinkQRView from "./signup-link-qr-view";

import { Button } from "@/components/ui/button";
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

function SignupLinkDetail() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);

  const { data, isLoading, error } = useGetSignupLinkByIdQuery(id);
  const [revokeLink, { isLoading: isRevoking }] = useRevokeSignupLinkMutation();

  const signupLink = data?.data;

  useBreadcrumb([
    {
      label: "Quản lý link đăng ký",
      href: "/quan-tri/link-dang-ky",
    },
    {
      label: "Chi tiết",
    },
  ]);

  const handleRevoke = async () => {
    if (!signupLink) return;

    try {
      const toastId = toast.loading("Đang thu hồi link...");
      await revokeLink(signupLink.id).unwrap();
      toast.success("Thu hồi link thành công", { id: toastId });
      setShowRevokeDialog(false);
      router.push("/quan-tri/link-dang-ky");
    } catch (err) {
      toast.error("Thu hồi link thất bại");
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-96 justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (error || !signupLink) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-muted-foreground">Không tìm thấy link đăng ký</p>
        <Button onClick={() => router.push("/quan-tri/link-dang-ky")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/quan-tri/link-dang-ky")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>

          {!signupLink.is_revoked && (
            <Button
              variant="destructive"
              onClick={() => setShowRevokeDialog(true)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Thu hồi link
            </Button>
          )}
        </div>

        <SignupLinkQRView link={signupLink} />
      </div>

      <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
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
              onClick={handleRevoke}
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

export default SignupLinkDetail;
