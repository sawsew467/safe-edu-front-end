"use client";
import { useRouter } from "next-nprogress-bar";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
type SubmitType = {
  isSubmit: boolean;
};
const ActionQuizz = ({ slug, data }: { slug: string; data: SubmitType }) => {
  "use client";
  const router = useRouter();

  return (
    <Button
      className="flex justify-center items-center gap-2  font-medium py-2 px-4 rounded-md"
      variant={!data?.isSubmit ? "default" : "outline"}
      onClick={() => {
        if (data?.isSubmit) router.push(`/phan-thi/${slug}/ket-qua`);
        else router.push(`/phan-thi/${slug}`);
      }}
    >
      {data?.isSubmit ? "Xem kết quả" : "Bắt đầu"}
      <ArrowRight className="size-24" />
    </Button>
  );
};

export default ActionQuizz;
