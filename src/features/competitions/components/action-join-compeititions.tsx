"use client";
import { useRouter } from "next-nprogress-bar";

import { Button } from "@/components/ui/button";

const ActionCompetitions = ({
  slug,
  status,
}: {
  slug: string;
  status: "Outgoing" | "Upcoming" | "Ongoing";
}) => {
  "use client";
  const router = useRouter();

  return (
    <Button
      className="w-full"
      variant={
        status === "Upcoming"
          ? "outline"
          : status === "Outgoing"
            ? "secondary"
            : "default"
      }
      onClick={() => {
        router.push(`/cuoc-thi/${slug}`);
      }}
    >
      {status === "Upcoming"
        ? "Xem trước"
        : status === "Outgoing"
          ? "Xem"
          : "Tham gia"}
    </Button>
  );
};

export default ActionCompetitions;
