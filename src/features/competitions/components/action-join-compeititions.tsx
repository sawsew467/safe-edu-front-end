"use client";
import { useRouter } from "next-nprogress-bar";

import { Button } from "@/components/ui/button";

const ActionCompetitions = ({ slug }: { slug: string }) => {
  "use client";
  const router = useRouter();

  return (
    <Button
      className="w-full"
      onClick={() => {
        router.push(`/cuoc-thi/${slug}`);
      }}
    >
      Tham gia
    </Button>
  );
};

export default ActionCompetitions;
