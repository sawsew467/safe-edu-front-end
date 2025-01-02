import * as z from "zod";
const phoneRegex = new RegExp(
  /^\+?[1-9]\d{0,2}[-\s]?(\(\d{2,4}\)|\d{2,4})[-\s]?\d{3}[-\s]?\d{3,4}$/,
);

export const formAdminSchema = z
  .object({
    first_name: z
      .string()
      .min(1, { message: "Đây là trường bắt buộc." })
      .max(25, { message: "Tên quá dài" })
      .trim(),

    last_name: z
      .string()
      .min(1, { message: "Đây là trường bắt buộc." })
      .max(25, { message: "Tên quá dài" })
      .trim(),
    email: z
      .string()
      .min(1, { message: "Đây là trường bắt buộc." })
      .email({ message: "Email không đúng định dạng." })
      .max(50, { message: "Mô tả phải lớn hơn 10 chữ" })
      .trim(),
    phone_number: z
      .string()
      .min(1, { message: "Đây là trường bắt buộc." })
      .regex(phoneRegex, "SDT không đúng định dạng"),
    password: z
      .string({ message: "Đây là trường bắt buộc." })
      .min(8, { message: "Mật khẩu phải có ít nhất 8 chữ số trở lên" })
      .max(20, { message: "Mật khẩu phải ít hơn 20 chữ số" }),
    confirmPassword: z
      .string({ message: "Đây là trường bắt buộc." })
      .min(8, { message: "Mật khẩu phải có ít nhất 8 chữ số trở lên" })
      .max(20, { message: "Mật khẩu phải ít hơn 20 chữ số" }),
  })
  .superRefine(({ confirmPassword, password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;

    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);

      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (countOfLowerCase < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Mật khẩu phải chứa ít nhất một chữ cái thường.",
        path: ["password"],
      });
    }

    if (countOfUpperCase < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Mật khẩu phải chứa ít nhất một chữ cái hoa.",
        path: ["password"],
      });
    }

    if (countOfSpecialChar < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.",
        path: ["password"],
      });
    }

    if (countOfNumbers < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Mật khẩu phải chứa ít nhất một chữ số.",
        path: ["password"],
      });
    }
    if (confirmPassword !== password) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });
