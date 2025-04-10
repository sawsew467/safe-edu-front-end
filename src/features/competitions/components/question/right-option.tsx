import React from "react";
import { Star, Timer } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { formSchema } from "./question-management";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const RightOption = ({
  form,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
}) => {
  return (
    <div className="h-full p-2 dark:bg-gray-600 bg-gray-200 rounded-lg">
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="time_limit"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel className="flex items-center gap-2 mb-2">
                <div className="text-gray-500">
                  <Timer color="white" size={20} />
                </div>
                <span className="font-medium">Giới hạn thời gian</span>
              </FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(e) => {
                    if (e) field.onChange(e);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới hạn thời gian câu hỏi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 giây</SelectItem>
                    <SelectItem value="20">20 giây</SelectItem>
                    <SelectItem value="30">30 giây</SelectItem>
                    <SelectItem value="60">60 giây</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="point"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel className="flex items-center gap-2 mb-2">
                <div className="text-gray-500">
                  <Star color="white" size={20} />
                </div>
                <span className="font-medium">Ngôi sao hy vọng</span>
              </FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(e) => {
                    if (e) field.onChange(e);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select points" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">Bình thường</SelectItem>
                    <SelectItem value="20">Gấp đôi điểm</SelectItem>
                    <SelectItem value="30">Gấp ba điểm</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default RightOption;
