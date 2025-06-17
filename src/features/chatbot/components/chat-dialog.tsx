"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
import { Send, ImageIcon, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Attachment } from "ai";

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

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: string[]; // array URL của ảnh đính kèm
}

export function ChatDialog({ open, onOpenChange }: ChatDialogProps) {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<Attachment[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    // Add user message to chat
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      images: imageUrls.map((img) => img.url),
    };

    let tempMessages = [...messages, newUserMessage];

    setMessages(tempMessages);
    setIsLoading(true);

    // Prepare all messages for the API call
    const chatHistory = [...messages, newUserMessage];

    setImageUrls([]);

    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: chatHistory, images: imageUrls }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        const rawContent =
          data?.choices?.[0]?.message?.content || data?.content || "";

        const assistantMessage: Message = {
          id: Date.now().toString() + "-assistant",
          role: "assistant",
          content: rawContent,
        };

        tempMessages = [...tempMessages, assistantMessage];

        setMessages(tempMessages);
      })
      .catch((err) => {
        const errorMessage: Message = {
          id: Date.now().toString() + "-error",
          role: "assistant",
          content:
            "Có lỗi xảy ra, vui lòng thử lại sau hoặc tạo sự cố trực tiếp cho bộ phận hỗ trợ",
        };

        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getImageUrl = useCallback(async (file: any) => {
    const formData = new FormData();

    formData.append("file", file);
    try {
      const { data } = await uploadImage(formData).unwrap();

      return data?.data;
    } catch {}
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userInput = input.trim();

    if (userInput && !isLoading) {
      handleSendMessage(userInput);
      setInput("");
    }
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
                    className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    </div>
                    {message.images && message.images.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2 justify-end">
                        {message.images.map((url, idx) => (
                          <Image
                            key={idx}
                            alt={`uploaded-${idx}`}
                            className="rounded object-cover aspect-video "
                            height={200}
                            src={url}
                            unoptimized={true}
                            width={200}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl bg-gray-100 px-4 py-3 text-gray-800">
                      <div className="flex items-center space-x-2 text-sm font-light italic">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Đang xử lý</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
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
                    unoptimized={true}
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
            onSubmit={handleSubmit}
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
              onChange={(e) => setInput(e.target.value)}
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
