"use client";
import React from "react";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next-nprogress-bar";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

import OptionsForm from "./OptionsForm";

import { Badge } from "@/components/ui/badge";
import { PartQuestion } from "@/app/(exam)/phan-thi/[id]/page";
import { Button } from "@/components/ui/button";
import { TimerProgress } from "@/components/ui/timer-progress";
import TimerProgressCircle from "@/components/ui/timer-progress-circle";
interface PropsPartCompetitionQuizz {
  title?: string;
  question?: PartQuestion[];
}
export const formSchema = z.object({
  choice_question: z.string({
    required_error: "Please select an answer.",
  }),
});
const PartCompetitionQuizz = ({
  title,
  question,
}: PropsPartCompetitionQuizz) => {
  const router = useRouter();
  const { id } = useParams();
  const [current_time, set_current_time] = React.useState(0);
  const [current_question_index, set_current_question] =
    React.useState<number>(0);
  const [open, setOpen] = React.useState(false);
  const current_question = question?.at(current_question_index);
  const currentTimeLimit = Number(current_question?.time_limit);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      choice_question: "",
    },
  });

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!open)
      interval = setInterval(() => {
        set_current_time((prev) => (prev < currentTimeLimit ? prev + 1 : prev));
      }, 1000);

    return () => clearInterval(interval);
  }, [open]);
  React.useEffect(() => {
    if (current_question?._id) {
      set_current_time(0);
    }
  }, [current_question?._id]);
  React.useEffect(() => {
    if (!question) return;
    if (current_time >= currentTimeLimit) {
      onSubmit({ choice_question: "" });
    }
  }, [current_time]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("data", data);
    if (current_question_index + 1 < question!.length) {
      setOpen(true);
      set_current_time(0);

      if (current_question_index < question!.length) {
        set_current_question((prev) => prev + 1);
        setOpen(false);
      }
    } else {
      router.replace(`/phan-thi/${id}/ket-qua`);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between md:py-4 py-2 h-full">
        <div className="space-y-4">
          <div className="flex w-full justify-between gap-4 items-center">
            <Button variant="destructive" onClick={() => router.back()}>
              <MoveLeft size={24} />
              <p className="text-lg font-semibold md:block hidden">Trở về</p>
            </Button>
            <div className="gap-2 flex">
              <Badge className="text-xl" variant="outline">
                Câu {current_question_index + 1} trên {question?.length ?? 0}
              </Badge>
              <Badge className="text-xl md:block hidden" variant="outline">
                {title}
              </Badge>
            </div>
          </div>
          <div className="md:hidden flex w-full justify-between gap-4 items-center">
            <TimerProgress
              className="w-full"
              max={currentTimeLimit}
              value={currentTimeLimit - current_time}
            />
          </div>
          <div className="flex w-full justify-center items-center">
            <motion.div
              key={current_question?.question}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              initial={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            >
              <Badge className="md:text-2xl text-base max-w-full text-center">
                {current_question?.question}
              </Badge>
            </motion.div>
          </div>
        </div>
        <div className="flex relative w-full justify-center items-center h-max">
          {current_question?.image && (
            <motion.div
              key={id + current_question.image} // Add key to trigger re-animation on image change
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              initial={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            >
              <Image
                alt={current_question?.question ?? "Không tìm thấy ảnh"}
                className="md:max-w-[300px] max-w-[250px] max-h-[250px] md:max-h-[300px] w-max h-max object-contain rounded-lg"
                height={400}
                src={current_question?.image ?? "/placeholder.png"}
                width={400}
              />
            </motion.div>
          )}
          <div className="md:block absolute hidden top-1/2 -translate-y-1/2 left-4 mt-0 h-[150px]">
            <TimerProgressCircle
              maxValue={currentTimeLimit}
              size={150}
              strokeWidth={14}
              value={currentTimeLimit - current_time}
            />
          </div>
        </div>
        <div>
          <OptionsForm
            current_answer={current_question?.answer}
            form={form}
            id={current_question?._id}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default PartCompetitionQuizz;
