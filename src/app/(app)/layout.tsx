import React from "react";

import AppLayout from "@/components/layouts/app/app-layout";
import { ChatButton } from "@/features/chatbot/components/chat-button";
function AppRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      {children}
      <ChatButton />
    </AppLayout>
  );
}

export default AppRootLayout;
