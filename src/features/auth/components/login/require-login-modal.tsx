"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RequireLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  showSkip?: boolean;
  onSkip?: () => void;
  showContinueWithoutLogin?: boolean;
  onContinueWithoutLogin?: () => void;
}

export function RequireLoginModal({
  open,
  onOpenChange,
  title = "Yêu cầu đăng nhập",
  description = "Bạn cần đăng nhập để sử dụng tính năng này. Đăng nhập để theo dõi báo cáo và nhận thông báo cập nhật.",
  showSkip = true,
  onSkip: _onSkip,
  showContinueWithoutLogin = false,
  onContinueWithoutLogin,
}: RequireLoginModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    onOpenChange(false);
    router.push("/dang-nhap");
  };

  const handleRegister = () => {
    onOpenChange(false);
    router.push("/dang-ky");
  };

  const handleContinueWithoutLogin = () => {
    onOpenChange(false);
    if (onContinueWithoutLogin) {
      onContinueWithoutLogin();
    } else {
      router.push("/");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        onEscapeKeyDown={(e) => {
          // Ngăn đóng modal bằng ESC khi bắt buộc đăng nhập
          if (!showSkip) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          // Ngăn đóng modal khi click bên ngoài nếu bắt buộc đăng nhập
          if (!showSkip) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Image
              alt="Login Required"
              className="max-h-24 w-auto"
              height={96}
              src="/images/auth/login.png"
              width={96}
            />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button className="w-full" type="button" onClick={handleLogin}>
            Đăng nhập
          </Button>
          <Button
            className="w-full !m-0"
            type="button"
            variant="secondary"
            onClick={handleRegister}
          >
            Chưa có tài khoản? Đăng ký ngay
          </Button>
          {showContinueWithoutLogin && (
            <Button
              className="w-full !m-0"
              type="button"
              variant="outline"
              onClick={handleContinueWithoutLogin}
            >
              Tiếp tục không đăng nhập
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
