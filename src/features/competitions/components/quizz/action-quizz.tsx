"use client";
import { useRouter } from "next-nprogress-bar";

import { Button } from "@/components/ui/button";

const ActionQuizz = ({ slug }: { slug: string }) => {
  "use client";
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push(`/phan-thi/${slug}`);
      }}
    >
      Bắt đầu
    </Button>
  );
};

export default ActionQuizz;
