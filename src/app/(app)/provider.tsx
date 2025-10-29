import React from "react";

import { ChatProvider } from "@/features/chatbot";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  return <ChatProvider>{children}</ChatProvider>;
};

export default UserProvider;
