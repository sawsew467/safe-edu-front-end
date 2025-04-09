import { z } from "zod";

export const formSchema = z.object({
  title: z
    .string({ message: "Đây là trường bắt buộc." })
    .min(1, { message: "Đây là trường bắt buộc." }),
  description: z
    .string({ message: "Đây là trường bắt buộc." })
    .min(1, { message: "Đây là trường bắt buộc." }),
  startDate: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date(),
    )
    .refine((date) => !isNaN(date.getTime()), {
      message: "Ngày không hợp lệ.",
    }),
  endDate: z
    .preprocess(
      (arg) => (typeof arg === "string" ? new Date(arg) : arg),
      z.date(),
    )
    .refine((date) => !isNaN(date.getTime()), {
      message: "Ngày không hợp lệ.",
    }),
  image_url: z
    .string({ message: "Đây là trường bắt buộc." })
    .min(1, { message: "Đây là trường bắt buộc." }),
  slug: z
    .string()
    .min(3, "Slug phải có ít nhất 3 ký tự")
    .max(50, "Slug không được vượt quá 50 ký tự")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug chỉ được chứa chữ thường, số và dấu gạch ngang (-)",
    ),
});
