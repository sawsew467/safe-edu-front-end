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
      return "from-green-400 to-green-600";
    case 1:
      return "from-red-400 to-red-600";
    case 2:
      return "from-blue-400 to-blue-600";
    case 3:
      return "from-orange-400 to-orange-600";
    default:
      return "from-[#d14334] to-[#922f24]";
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
                      "w-full text-center whitespace-normal md:py-4 h-full py-2 break-words break-all font-bold transition-all bg-gradient-to-br",
                      pickColor(index),
                    )}
                    value={answer}
                    onClick={() => field.onChange(answer)}
                  >
                    <p className="text-sm break-words break-all">{answer}</p>
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
