"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { AppProgressBar } from "next-nprogress-bar";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

import { store } from "@/redux/store";
import { ChatProvider } from "@/features/chatbot";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <React.Suspense>
      <ThemeProvider
        enableSystem
        attribute="class"
        defaultTheme="system"
        storageKey="color-theme"
      >
        <AppProgressBar
          shallowRouting
          color="#75A815"
          height="4px"
          options={{ showSpinner: false }}
        />
        <Provider store={store}>
          <ChatProvider>
            <Toaster closeButton richColors position="top-right" />
            {children}
          </ChatProvider>
        </Provider>
      </ThemeProvider>
    </React.Suspense>
  );
}
