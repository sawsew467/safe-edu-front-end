"use client";
import React, { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Maximize2, X } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { SignupLink } from "../signup-link.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Props = {
  link: SignupLink;
  onClose?: () => void;
  showCloseButton?: boolean;
};

function SignupLinkQRView({ link, onClose, showCloseButton = false }: Props) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  // Generate the signup URL
  const signupUrl = `${window.location.origin}/dang-ky?token=${link._id}`;

  const handleCopy = async () => {
    try {
      // Check if clipboard API is available
      if (!navigator?.clipboard) {
        // Fallback for older browsers or non-HTTPS contexts
        const textArea = document.createElement("textarea");
        textArea.value = signupUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        await navigator.clipboard.writeText(signupUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const enterFullscreen = async () => {
    setIsFullscreen(true);
    try {
      if (fullscreenRef.current) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.error("Error entering fullscreen:", err);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch (err) {
      console.error("Error exiting fullscreen:", err);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        exitFullscreen();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  const QRCodeDisplay = ({ size = 256 }: { size?: number }) => {

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG
            value={signupUrl}
            size={size}
            level="H"
            imageSettings={{
              src: "/images/logo/logo.png",
              x: undefined,
              y: undefined,
              height: 50,
              width: 50,
              excavate: true,
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Link đăng ký</CardTitle>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={enterFullscreen}
              title="Xem toàn màn hình (F11)"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            {showCloseButton && onClose && (
              <Button
                size="icon"
                variant="outline"
                onClick={onClose}
                title="Đóng"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <QRCodeDisplay />

          <div className="space-y-2">
            <Label>Đường link</Label>
            <div className="flex gap-2">
              <Input value={signupUrl} readOnly className="font-mono text-sm" />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
                title="Sao chép"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Ngày bắt đầu</Label>
              <p className="font-medium">
                {format(new Date(link.start_date), "dd/MM/yyyy HH:mm", {
                  locale: vi,
                })}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Ngày hết hạn</Label>
              <p className="font-medium">
                {format(new Date(link.expiration_date), "dd/MM/yyyy HH:mm", {
                  locale: vi,
                })}
              </p>
            </div>
          </div>

          <div className="text-sm">
            <Label className="text-muted-foreground">Trạng thái</Label>
            <p className="font-medium">
              {link.is_revoked ? (
                <span className="text-red-500">Đã thu hồi</span>
              ) : (
                <span className="text-green-500">Đang hoạt động</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen Overlay */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="w-screen max-w-none h-screen bg-stone-900 ">
          <div
            ref={fullscreenRef}
            className="w-full h-full  flex flex-col items-center justify-center"
          >
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={exitFullscreen}
              title="Thoát toàn màn hình (ESC)"
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="flex flex-col items-center gap-8 max-w-4xl w-full">
              <h2 className="text-3xl font-bold text-white">Mã QR Đăng Ký</h2>

              <div className="bg-white p-8 rounded-2xl shadow-2xl">
                <QRCodeSVG
                  value={signupUrl}
                  size={400}
                  level="H"
                  imageSettings={{
                    src: "/images/logo/logo.png",
                    x: undefined,
                    y: undefined,
                    height: 100,
                    width: 100,
                    excavate: true,
                  }}
                />
              </div>

              <div className="w-full max-w-2xl space-y-4">
                <Label className="text-white text-lg">Đường link</Label>
                <div className="flex gap-2">
                  <Input
                    value={signupUrl}
                    readOnly
                    className="font-mono text-sm bg-white/10 text-white border-white/20"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleCopy}
                    title="Sao chép"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-white/70 text-sm">
                Nhấn ESC hoặc nút X để thoát
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SignupLinkQRView;
