"use client";
import { useRouter } from "next-nprogress-bar";

import { Button } from "@/components/ui/button";

const ActionCompetitions = ({
  slug,
  status,
  statusCompetitions,
}: {
  slug: string;
  status: "Outgoing" | "Upcoming" | "Ongoing";
  statusCompetitions?: "done" | "not-start" | "doing";
}) => {
  "use client";
  const router = useRouter();

  return (
    <Button
      className="w-full"
      variant={
        status === "Upcoming"
          ? "outline"
          : status === "Outgoing" ||
              statusCompetitions === "done" ||
              statusCompetitions === "not-start"
            ? "secondary"
            : "default"
      }
      onClick={() => {
        router.push(`/cuoc-thi/${slug}`);
      }}
    >
      {status === "Upcoming"
        ? "Xem trước"
        : status === "Outgoing" ||
            statusCompetitions === "done" ||
            statusCompetitions === "not-start"
          ? "Xem"
          : statusCompetitions === "doing"
            ? "Tiếp tục"
            : "Tham gia"}
    </Button>
  );
};

export default ActionCompetitions;
