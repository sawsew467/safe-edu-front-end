"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
  isOpen: boolean;
  initialPrompt?: string;
  shouldClearMessages: boolean;
  openChat: (prompt?: string) => void;
  closeChat: () => void;
  openEmergencyChat: (prompt?: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string>();
  const [shouldClearMessages, setShouldClearMessages] = useState(false);

  const openChat = (prompt?: string) => {
    setInitialPrompt(prompt);
    setShouldClearMessages(false);
    setIsOpen(true);
  };

  const openEmergencyChat = (prompt?: string) => {
    setInitialPrompt(prompt);
    setShouldClearMessages(true);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
    setInitialPrompt(undefined);
    setShouldClearMessages(false);
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        initialPrompt,
        shouldClearMessages,
        openChat,
        closeChat,
        openEmergencyChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
}
