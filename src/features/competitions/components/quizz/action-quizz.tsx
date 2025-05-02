"use client";
import { useRouter } from "next-nprogress-bar";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuizzType } from "@/settings/enums";
type SubmitType = {
  isSubmit: boolean;
  type: string;
};

const getConentBtn = (
  type: string,
  isSubmit: boolean,
  status: "Upcoming" | "Outgoing" | "Ongoing",
) => {
  switch (type) {
    case QuizzType.SingleChoice:
      return isSubmit
        ? "Xem kết quả"
        : status === "Ongoing"
          ? "Bắt đầu"
          : status === "Upcoming"
            ? "Chưa bắt đầu"
            : "Đã kết thúc";
    case QuizzType.PaintingPropaganda:
      return isSubmit || status !== "Ongoing" ? "Xem tranh" : "Tham gia";
  }
};

const ActionQuizz = ({
  slug,
  data,
  status,
}: {
  slug: string;
  data: SubmitType;
  status: "Upcoming" | "Outgoing" | "Ongoing";
}) => {
  "use client";
  const router = useRouter();

  return (
    <div className="flex gap-2">
      <Button
        className="flex justify-center items-center gap-2  font-medium py-2 px-4 rounded-md"
        disabled={
          status !== "Ongoing" &&
          data?.type === QuizzType.SingleChoice &&
          !data?.isSubmit
        }
        variant={!data?.isSubmit ? "default" : "outline"}
        onClick={() => {
          switch (data?.type) {
            case QuizzType.SingleChoice:
              if (data?.isSubmit)
                router.push(`/phan-thi-ly-thuyet/${slug}/ket-qua`);
              else router.push(`/phan-thi-ly-thuyet/${slug}`);
              break;
            case QuizzType.PaintingPropaganda:
              router.push(`/phan-thi-ve-tranh-co-dong/${slug}`);
              break;
          }
        }}
      >
        {getConentBtn(data?.type, data?.isSubmit, status)}
        <ArrowRight className="size-24" />
      </Button>
    </div>
  );
};

export default ActionQuizz;
