import * as z from "zod";

// Validation schema for phone number step
export const phoneNumberSchema = z.object({
  username: z.string().min(1, { message: "Vui lòng nhập tên đăng nhập" }),
  password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
});

export type PhoneNumberFormValues = z.infer<typeof phoneNumberSchema>;
// Base schema without refinement

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
const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

// Student registration schema (extends base schema)
export const studentRegistrationSchema = z
  .object({
    organizationId: z.string().min(1, { message: "Vui lòng chọn trường" }),
    provinceId: z.string().min(1, { message: "Vui lòng chọn trường" }),
    username: z.string().min(1, { message: "Vui lòng nhập tên đăng nhập" }),
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
    date_of_birth: z.string().min(1, { message: "Vui lòng chọn ngày sinh" }),
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
    username: z.string().min(1, { message: "Vui lòng nhập tên đăng nhập" }),
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
    date_of_birth: z.string().min(1, { message: "Vui lòng chọn ngày sinh" }),
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
