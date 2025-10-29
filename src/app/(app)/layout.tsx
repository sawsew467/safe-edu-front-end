import React from "react";

import UserProvider from "./provider";

import AppLayout from "@/components/layouts/app/app-layout";
import { ChatButton } from "@/features/chatbot";
function AppRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <AppLayout>
        {children}
        <ChatButton />
      </AppLayout>
    </UserProvider>
  );
}

export default AppRootLayout;
