import * as z from "zod";

// Validation schema for phone number step
export const phoneNumberSchema = z.object({
  username: z.string().min(1, { message: "Vui lòng nhập tên đăng nhập" }),
  password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
});

export const ChangePasswordShema = z
  .object({
    old_password: z.string().min(1, { message: "Vui lòng nhập mật khẩu cũ" }),
    password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
    confirm_password: z
      .string()
      .min(1, { message: "Vui lòng xác nhận mật khẩu" }),
  })
  .refine((data) => data.confirm_password === data.password, {
    message: "Mật khẩu không khớp",
    path: ["confirm_password"],
  })
  .refine(
    (data) =>
      /[A-Z]/.test(data.password) &&
      /[a-z]/.test(data.password) &&
      /[0-9]/.test(data.password) &&
      /[^A-Za-z0-9]/.test(data.password),
    {
      message:
        "Mật khẩu phải có ít nhất 1 chữ in hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
      path: ["password"],
    },
  )
  .refine((data) => data.old_password !== data.password, {
    message: "Mật khẩu mới không được giống mật khẩu cũ",
    path: ["password"],
  });

export type PhoneNumberFormValues = z.infer<typeof phoneNumberSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Vui lòng nhập email" })
    .email({ message: "Email không hợp lệ" }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const verifyOtpFormSchema = z.object({
  otp: z.string().min(6, { message: "Mã OTP phải có 6 chữ số" }),
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpFormSchema>;

export const resetPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự." })
      .regex(/[A-Z]/, {
        message: "Mật khẩu phải có ít nhất một chữ cái viết hoa.",
      })
      .regex(/[a-z]/, {
        message: "Mật khẩu phải có ít nhất một chữ cái viết thường.",
      })
      .regex(/[0-9]/, { message: "Mật khẩu phải có ít nhất một chữ số." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

// Validation schema for OTP step
export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "Mã OTP phải có 6 chữ số" })
    .regex(/^\d+$/, { message: "Mã OTP chỉ được chứa chữ số" }),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

// Validation schema for user type step
export const userTypeSchema = z.object({
  userType: z.enum(["student", "citizen"], {
    required_error: "Vui lòng chọn loại người dùng",
  }),
});

export type UserTypeFormValues = z.infer<typeof userTypeSchema>;

// Base registration schema (common fields)
const phoneRegex = new RegExp(/^0\d{8,12}$/);

// Student registration schema (extends base schema)
export const studentRegistrationSchema = z
  .object({
    organizationId: z.string().optional(),
    provinceId: z.string().optional(),
    username: z
      .string()
      .min(1, { message: "Vui lòng nhập tên đăng nhập" })
      .regex(/^[\w-]+$/, {
        message:
          "Tên đăng nhập chỉ được chứa chữ cái không dấu, số, dấu gạch dưới và dấu gạch ngang",
      }),
    password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Vui lòng xác nhận mật khẩu" }),
    terms: z.boolean(),
    last_name: z
      .string()
      .min(1, { message: "Vui lòng nhập họ" })
      .max(50, { message: "Họ không được quá 50 ký tự" }),
    phone_number: z
      .union([
        z.string().regex(phoneRegex, "Số điện thoại không hợp lệ!"),
        z.null(),
        z.literal(""),
      ])
      .optional(),
    email: z
      .union([
        z.string().email({ message: "Email không hợp lệ" }),
        z.null(),
        z.literal(""),
      ])
      .optional(),
    first_name: z
      .string()
      .min(1, { message: "Vui lòng nhập tên" })
      .max(50, { message: "Tên không được quá 50 ký tự" }),
    date_of_birth: z
      .union([
        z
          .string({ message: "ngày sinh không hợp lệ " })
          .min(1, { message: "ngày sinh không hợp lệ " }),
        z.null(),
        z.literal(""),
      ])
      .optional(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  })
  .refine((data) => data.terms === true, {
    message: "Bạn phải đồng ý với điều khoản và điều kiện",
    path: ["terms"],
  })
  .refine(
    (data) =>
      /[A-Z]/.test(data.password) &&
      /[a-z]/.test(data.password) &&
      /[0-9]/.test(data.password) &&
      /[^A-Za-z0-9]/.test(data.password),
    {
      message:
        "Mật khẩu phải có ít nhất 1 chữ in hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
      path: ["password"],
    },
  );

export type SignUpFormValues = z.infer<typeof studentRegistrationSchema>;

// Citizen registration schema (same as base schema for now)
export const citizenRegistrationSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: "Vui lòng nhập tên đăng nhập" })
      .regex(/^[\w-]+$/, {
        message:
          "Tên đăng nhập chỉ được chứa chữ cái không dấu, số, dấu gạch dưới và dấu gạch ngang",
      }),
    password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Vui lòng xác nhận mật khẩu" }),
    terms: z.boolean(),
    phone_number: z
      .union([
        z.string().regex(phoneRegex, "Số điện thoại không hợp lệ!"),
        z.null(),
        z.literal(""),
      ])
      .optional(),
    email: z
      .union([
        z.string().email({ message: "Email không hợp lệ" }),
        z.null(),
        z.literal(""),
      ])
      .optional(),
    last_name: z
      .string()
      .min(1, { message: "Vui lòng nhập họ" })
      .max(50, { message: "Họ không được quá 50 ký tự" }),
    first_name: z
      .string()
      .min(1, { message: "Vui lòng nhập tên" })
      .max(50, { message: "Tên không được quá 50 ký tự" }),
    date_of_birth: z
      .union([
        z.string({ message: "ngày sinh không hợp lệ " }).min(1, {
          message: "ngày sinh không hợp lệ ",
        }),
        z.null(),
        z.literal(""),
      ])
      .optional(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  })
  .refine((data) => data.terms === true, {
    message: "Bạn phải đồng ý với điều khoản và điều kiện",
    path: ["terms"],
  })
  .refine(
    (data) =>
      /[A-Z]/.test(data.password) &&
      /[a-z]/.test(data.password) &&
      /[0-9]/.test(data.password) &&
      /[^A-Za-z0-9]/.test(data.password),
    {
      message:
        "Mật khẩu phải có ít nhất 1 chữ in hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
      path: ["password"],
    },
  );

export type StudentRegistrationFormValues = z.infer<
  typeof studentRegistrationSchema
>;
export type CitizenRegistrationFormValues = z.infer<
  typeof citizenRegistrationSchema
>;
