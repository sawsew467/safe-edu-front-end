import { Metadata } from "next";
import React from "react";

import DescriptionModule from "@/features/library/components/description-library";
export const metadata: Metadata = {
  title: "Mô tả bài viết thư viện",
};
const DescPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);

  return <DescriptionModule id={id} />;
};

export default DescPage;
