"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

import { ChatDialog } from "./chat-dialog";

import { Button } from "@/components/ui/button";

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        aria-label="Mở chatbot"
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg bg-primary transition-all hover:bg-primary/60 p-0 flex items-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-8 w-8" />
      </Button>
      <ChatDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
