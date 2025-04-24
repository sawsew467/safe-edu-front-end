"use client";
import { useRouter } from "next-nprogress-bar";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuizzType } from "@/settings/enums";
type SubmitType = {
  isSubmit: boolean;
  type: string;
};

const getConentBtn = (type: string, isSubmit: boolean) => {
  switch (type) {
    case QuizzType.SingleChoice:
      return isSubmit ? "Xem kết quả" : "Bắt đầu";
    case QuizzType.PaintingPropaganda:
      return isSubmit ? "Xem tranh" : "Tham gia";
  }
};

const ActionQuizz = ({ slug, data }: { slug: string; data: SubmitType }) => {
  "use client";
  const router = useRouter();

  return (
    <div className="flex gap-2">
      <Button
        className="flex justify-center items-center gap-2  font-medium py-2 px-4 rounded-md"
        variant={!data?.isSubmit ? "default" : "outline"}
        onClick={() => {
          switch (data?.type) {
            case QuizzType.SingleChoice:
              if (data?.isSubmit)
                router.replace(`/phan-thi-ly-thuyet/${slug}/ket-qua`);
              else router.replace(`/phan-thi-ly-thuyet/${slug}`);
              break;
            case QuizzType.PaintingPropaganda:
              router.replace(`/phan-thi-ve-tranh-co-dong/${slug}`);
              break;
          }
        }}
      >
        {getConentBtn(data?.type, data?.isSubmit)}
        <ArrowRight className="size-24" />
      </Button>
    </div>
  );
};

export default ActionQuizz;
