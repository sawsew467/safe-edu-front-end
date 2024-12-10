import * as z from "zod";

export const formNewsSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Tiêu đề phải lớn hơn 5 chữ" })
    .max(100, { message: "Tiêu đề quá dài" })
    .trim(),
  thumbnail: z.string(),
  desc: z.string().min(5, { message: "Mô tả phải lớn hơn 5 chữ" }).trim(),
});
