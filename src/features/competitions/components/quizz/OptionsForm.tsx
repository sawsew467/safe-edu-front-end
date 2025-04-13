import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";

import { formSchema } from "./PartCompetitionQuizz";

import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const pickColor = (index: number) => {
  switch (index) {
    case 0:
      return "bg-[#00b4fc] hover:bg-[#007eb0]";
    case 1:
      return "bg-[#028f76] hover:bg-[#016453]";
    case 2:
      return "bg-[#f38630] hover:bg-[#aa5e22]";
    case 3:
      return "bg-[#97483d] hover:bg-[#7d1a0c]";
    default:
      return "bg-[#d14334] hover:bg-[#922f24]";
  }
};
const OptionsForm = ({
  current_answer,
  form,
  onSubmit,
  id,
}: {
  current_answer?: (string | undefined)[];
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
  id?: string;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}) => {
  return (
    <div>
      <Form {...form}>
        <form
          className="grid md:grid-cols-2 grid-cols-1 w-full justify-between md:gap-8 gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {current_answer?.map((answer, index) => (
            <FormField
              key={index}
              control={form.control}
              name="choice_question"
              render={({ field }) => (
                <motion.div
                  key={(id ?? "") + answer}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                >
                  <Button
                    className={cn(
                      "w-full md:py-8 py-6 font-bold",
                      pickColor(index),
                    )}
                    value={answer}
                    onClick={() => field.onChange(answer)}
                  >
                    {answer}
                  </Button>
                </motion.div>
              )}
            />
          ))}
        </form>
      </Form>
    </div>
  );
};

export default OptionsForm;
