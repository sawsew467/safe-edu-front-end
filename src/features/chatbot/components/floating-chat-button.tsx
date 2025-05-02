"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import {
  MessageCircle,
  X,
  Send,
  Image,
  Maximize2,
  Minimize2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUploadImageMutation } from "@/services/common/upload/api.upload";

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // console.log("🚀 ~ FloatingChatButton ~ imagePreview:", imagePreview);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileButtonRef = useRef<HTMLButtonElement>(null);

  const [upload, { isLoading: isUploading }] = useUploadImageMutation();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Xin chào! Tôi là trợ lý ảo của SafeEdu. Tôi có thể giúp bạn trả lời các câu hỏi về phòng chống ma túy, bạo lực học đường và bình đẳng giới. Bạn cần hỗ trợ gì?",
        parts: [
          {
            type: "text",
            text: "Xin chào! Tôi là trợ lý ảo của SafeEdu. Tôi có thể giúp bạn trả lời các câu hỏi về phòng chống ma túy, bạo lực học đường và bình đẳng giới. Bạn cần hỗ trợ gì?",
          },
        ],
      },
    ],
  });

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsFullscreen(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);

    try {
      const response = await upload(formData).unwrap();
      const imageUrl = response?.data;

      setSelectedImage(file);
      setImagePreview(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ((!input.trim() && !selectedImage) || isLoading) return;

    if (selectedImage && imagePreview) {
      // Create a message with both text and image
      const messageText = input.trim()
        ? `${input.trim()}\n\n[Đã gửi hình ảnh]`
        : "[Đã gửi hình ảnh]";

      // Set the input with the combined message
      setInput(messageText);

      // Clear the image preview
      removeImage();

      // Submit the form after a short delay to ensure the input is updated
      setTimeout(() => {
        handleSubmit(e, {
          // experimental_attachments: selectedImage,
        });
      }, 100);
    } else {
      // Just submit the text input
      handleSubmit(e);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, imagePreview]);

  // Detect mobile device
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <>
      {/* Chat Dialog */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-300 flex flex-col bg-background border border-border rounded-lg shadow-lg",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          isFullscreen || (isMobile && isOpen)
            ? "inset-4 h-[calc(100vh-32px)]" // Fullscreen mode
            : "bottom-20 right-4 w-80 sm:w-96 h-[500px]", // Normal mode
        )}
      >
        {/* Chat Header */}
        <div className="p-3 border-b flex justify-between items-center bg-[#8BC34A] text-white rounded-t-lg">
          <h3 className="font-medium flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            SafeEdu Trợ lý
          </h3>
          <div className="flex items-center gap-1">
            <Button
              aria-label={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
              className="h-8 w-8 text-white hover:bg-[#7cb342]"
              size="icon"
              variant="ghost"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              aria-label="Đóng"
              className="h-8 w-8 text-white hover:bg-[#7cb342]"
              size="icon"
              variant="ghost"
              onClick={toggleChat}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9FBF9]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[85%] rounded-lg p-3 shadow-sm",
                message.role === "user"
                  ? "bg-[#E8F5E9] text-[#2E7D32] ml-auto"
                  : "bg-white text-[#37474F] border border-[#E0E0E0]",
              )}
            >
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="whitespace-pre-wrap"
                      >
                        {part.text}
                      </div>
                    );
                  case "tool-invocation":
                    return (
                      <pre
                        key={`${message.id}-${i}`}
                        className="text-xs overflow-x-auto"
                      >
                        {JSON.stringify(part.toolInvocation, null, 2)}
                      </pre>
                    );
                }
              })}
            </div>
          ))}
          {isLoading && (
            <div className="bg-white text-[#37474F] max-w-[85%] rounded-lg p-3 border border-[#E0E0E0] shadow-sm">
              <div className="flex space-x-2">
                <div className="h-2 w-2 rounded-full bg-[#8BC34A] animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-[#8BC34A] animate-bounce delay-75" />
                <div className="h-2 w-2 rounded-full bg-[#8BC34A] animate-bounce delay-150" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="p-2 border-t border-[#E0E0E0] bg-white">
            <div className="relative inline-block">
              <img
                alt="Preview"
                className="h-20 w-auto rounded-md object-cover"
                src={imagePreview || "/placeholder.svg"}
              />
              <button
                aria-label="Xóa hình ảnh"
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                onClick={removeImage}
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Chat Input */}
        <form className="p-3 border-t flex gap-2 bg-white" onSubmit={onSubmit}>
          <input
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            type="file"
            onChange={handleImageChange}
          />
          <Button
            aria-label="Gửi hình ảnh"
            className="h-10 w-10 text-[#8BC34A] hover:bg-[#F1F8E9] rounded-full flex-shrink-0"
            size="icon"
            type="button"
            variant="ghost"
            onClick={handleImageClick}
          >
            <Image className="h-5 w-5" />
          </Button>
          <input
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BC34A]"
            placeholder="Nhập câu hỏi của bạn..."
            value={input}
            onChange={handleInputChange}
          />
          <Button
            aria-label="Gửi"
            className="h-10 w-10 bg-[#8BC34A] hover:bg-[#7cb342] text-white rounded-full flex-shrink-0"
            disabled={(!input.trim() && !selectedImage) || isLoading}
            size="icon"
            type="submit"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>

      {/* Floating Button */}
      <Button
        aria-label="Mở trợ lý ảo"
        className={cn(
          "fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg flex items-center justify-center z-50",
          "bg-[#8BC34A] hover:bg-[#7cb342] text-white",
        )}
        onClick={toggleChat}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </>
  );
}
