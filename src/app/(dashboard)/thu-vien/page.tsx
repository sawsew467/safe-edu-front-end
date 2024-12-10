import { Metadata } from "next";
import React from "react";

import LibbraryManagementModule from "@/components/module/LibraryManagementModule";
export const metadata: Metadata = {
  title: "Quản Lí Thư Viện",
};
const Library = () => {
  return <LibbraryManagementModule />;
};

export default Library;
