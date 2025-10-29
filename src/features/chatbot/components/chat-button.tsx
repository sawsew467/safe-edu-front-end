"use client";

import Image from "next/image";

import { useChat } from "../contexts/chat-context";

import { ChatDialog } from "./chat-dialog";

import { Button } from "@/components/ui/button";

export function ChatButton() {
  const { isOpen, initialPrompt, shouldClearMessages, openChat, closeChat } =
    useChat();

  return (
    <>
      <Button
        aria-label="Mở chatbot"
        className="fixed bottom-6 right-6 rounded-full  z-10 w-fit h-fit shadow-none transition-all bg-transparent hover:bg-transparent p-0 flex items-center justify-center"
        onClick={() => openChat()}
      >
        <Image
          alt="chatbot"
          className="hover:scale-105 transition-all duration-300 drop-shadow-lg "
          height={128}
          src="/images/chatbot/chatbot.png"
          width={128}
        />
      </Button>
      <ChatDialog
        initialPrompt={initialPrompt}
        open={isOpen}
        shouldClearMessages={shouldClearMessages}
        onOpenChange={closeChat}
      />
    </>
  );
}
