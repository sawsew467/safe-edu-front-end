import * as z from "zod";

export const formNewsSchema = z.object({
  title: z
    .string({
      required_error: "Đây là trường bắt buộc.",
    })
    .min(5, { message: "Tiêu đề phải lớn hơn 5 chữ" })
    .max(100, { message: "Tiêu đề quá dài" })
    .trim(),
  thumbnail: z.string({
    required_error: "Đây là trường bắt buộc.",
  }),
  desc: z
    .string({
      required_error: "Đây là trường bắt buộc.",
    })
    .min(5, { message: "Mô tả phải lớn hơn 5 chữ" })
    .trim(),
  topic: z.string({
    required_error: "Đây là trường bắt buộc.",
  }),
});
