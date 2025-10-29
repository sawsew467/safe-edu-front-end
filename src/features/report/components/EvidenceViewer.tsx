"use client";

import { useState } from "react";
import { FileText, Download, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EvidenceViewerProps {
  evidenceUrl?: string | string[];
}

export function EvidenceViewer({ evidenceUrl }: EvidenceViewerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Normalize evidence URLs to array
  const evidenceUrls = evidenceUrl
    ? Array.isArray(evidenceUrl)
      ? evidenceUrl
      : [evidenceUrl]
    : [];

  if (evidenceUrls.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Không có bằng chứng đính kèm
      </div>
    );
  }

  const getFileType = (url: string): "image" | "video" | "other" => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];

    const lowerUrl = url.toLowerCase();

    if (imageExtensions.some((ext) => lowerUrl.includes(ext))) {
      return "image";
    }
    if (videoExtensions.some((ext) => lowerUrl.includes(ext))) {
      return "video";
    }

    return "other";
  };

  const getFileName = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const fileName = pathname.split("/").pop() || "file";

      return fileName;
    } catch {
      return url.split("/").pop() || "file";
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evidenceUrls.map((url, index) => {
          const fileType = getFileType(url);
          const fileName = getFileName(url);

          if (fileType === "image") {
            return (
              <button
                key={index}
                className="relative group cursor-pointer rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
                onClick={() => setSelectedImage(url)}
              >
                <div className="aspect-video relative bg-muted">
                  <Image
                    fill
                    alt={`Evidence ${index + 1}`}
                    className="object-cover"
                    src={url}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="p-2 bg-background">
                  <p className="text-xs text-muted-foreground truncate">
                    {fileName}
                  </p>
                </div>
              </button>
            );
          }

          if (fileType === "video") {
            return (
              <div
                key={index}
                className="rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
              >
                <video
                  controls
                  className="w-full aspect-video object-cover"
                  src={url}
                >
                  <track kind="captions" />
                </video>
                <div className="p-2 bg-background">
                  <p className="text-xs text-muted-foreground truncate">
                    {fileName}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="p-4 rounded-lg border hover:shadow-lg transition-shadow bg-card"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-muted">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{fileName}</p>
                  <p className="text-xs text-muted-foreground">File đính kèm</p>
                </div>
              </div>
              <Button
                asChild
                className="w-full mt-3"
                size="sm"
                variant="outline"
              >
                <a
                  download
                  href={url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tải xuống
                </a>
              </Button>
            </div>
          );
        })}
      </div>

      {/* Image Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Xem bằng chứng</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative w-full" style={{ minHeight: "400px" }}>
              <Image
                fill
                alt="Evidence preview"
                className="object-contain"
                src={selectedImage}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
