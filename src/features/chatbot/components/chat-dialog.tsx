"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Send, ImageIcon, X } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import Image from "next/image";
import { Attachment } from "ai";
import Markdown from "react-markdown";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUploadImageMutation } from "@/services/common/upload/api.upload";
import { Input } from "@/components/ui/input";
import { AutoExpandingTextarea } from "@/components/ui/auto-expanding-textarea";

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatDialog({ open, onOpenChange }: ChatDialogProps) {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<Attachment[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    });

  const getImageUrl = useCallback(async (file: any) => {
    const formData = new FormData();

    formData.append("image", file);
    try {
      const res = await uploadImage(formData).unwrap();

      return res?.data;
    } catch (err) {
      console.log("🚀 ~ handleUploadImage ~ err:", err);
    }
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);

      setImages((prev) => [...prev, ...newImages]);

      for (const file of newImages) {
        try {
          const imageUrl = await getImageUrl(file);

          if (imageUrl) {
            setImageUrls((prev) => [
              ...prev,
              {
                url: imageUrl,
                name: file.name,
                contentType: file.type,
              },
            ]);
          }
        } catch (error) {
          console.error("Failed to upload image:", error);
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleSubmit(e, {
      experimental_attachments: imageUrls,
    });

    setImages([]);
    setImageUrls([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-center text-lg font-bold text-green-700">
            SafeEdu Chatbot
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-6">
                <p>Xin chào! Tôi có thể giúp bạn với các chủ đề:</p>
                <ul className="mt-2 list-disc list-inside text-left max-w-xs mx-auto">
                  <li>Phòng chống ma túy</li>
                  <li>Bạo lực học đường</li>
                  <li>Bình đẳng giới</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex flex-col gap-2 ${message.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div className="flex flex-wrap gap-2">
                        {message.experimental_attachments?.map((attachment) => (
                          <div key={attachment.url}>
                            <Image
                              alt={attachment.name || "Attachment"}
                              className="rounded-lg aspect-square object-cover"
                              height={128}
                              src={attachment.url}
                              width={128}
                            />
                          </div>
                        ))}
                      </div>
                      <div
                        className={`rounded-lg px-3 py-2 max-w-[80%] ${
                          message.role === "user"
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <Markdown>{message.content}</Markdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-lg px-3 py-2 bg-gray-100 text-gray-800">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {imageUrls.length > 0 && (
            <div className="p-2 border-t flex gap-2 overflow-x-auto">
              {imageUrls.map((item, index) => (
                <div key={index} className="relative h-16 w-16 flex-shrink-0">
                  <Image
                    fill
                    alt={`Uploaded image ${index + 1}`}
                    className="object-cover rounded"
                    src={item.url || "/placeholder.svg"}
                  />
                  <button
                    aria-label="Remove image"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form
            className="p-4 border-t flex gap-2 items-end"
            onSubmit={handleFormSubmit}
          >
            <Input
              ref={fileInputRef}
              multiple
              accept="image/*"
              className="hidden"
              type="file"
              onChange={handleImageUpload}
            />
            <Button
              aria-label="Upload images"
              className="flex-shrink-0"
              size="icon"
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <AutoExpandingTextarea
              className="w-full"
              placeholder="Nhập câu hỏi của bạn..."
              value={input}
              onChange={handleInputChange}
            />
            <Button
              className="flex-shrink-0"
              disabled={isLoading || (!input.trim() && images.length === 0)}
              size="icon"
              type="submit"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
