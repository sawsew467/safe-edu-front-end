"use client";

import { useState } from "react";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import React from "react";

import {
  useCreateCitizenAccountMutation,
  useCreateStudentAccountMutation,
  useGetProvincesQuery,
} from "../../api";
import { setAccessToken, setRefreshToken, setUserRole } from "../../slice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type StudentRegistrationFormValues,
  type CitizenRegistrationFormValues,
  studentRegistrationSchema,
  citizenRegistrationSchema,
} from "@/features/auth/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Province } from "@/features/users/user.types";
import { useGetAllOrganizationQuery } from "@/features/organizations/organization.api";
import { Organization } from "@/features/organizations/types";
import { Combobox } from "@/components/ui/comboBox";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch } from "@/hooks/redux-toolkit";
import DateInputForm from "@/components/ui/date-input-form";

interface RegistrationFormProps {
  userType: "student" | "citizen";
  onBack: () => void;
}

type OrganizationOptions = {
  label: string;
  value: string;
  province_id?: string;
};

export default function RegistrationForm({
  userType,
  onBack,
}: RegistrationFormProps) {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectProvince, setSelectProvince] = useState("");
  const [organizationsByProvince, setOrganizationsByProvince] = useState([]);
  const dispatch = useAppDispatch();

  const [createCitizenAccount] = useCreateCitizenAccountMutation();
  const [createStudentAccount] = useCreateStudentAccountMutation();

  const { provinces }: { provinces: Array<{ label: string; value: string }> } =
    useGetProvincesQuery(
      {},
      {
        selectFromResult: ({ data }) => {
          return {
            provinces: data?.data
              ? data?.data?.items?.map((province: Province) => ({
                  label: province.name,
                  value: province._id,
                }))
              : [],
          };
        },
      },
    );
  const { organizations } = useGetAllOrganizationQuery(undefined, {
    skip: !provinces,
    selectFromResult: ({ data }) => {
      return {
        organizations: data?.data
          ? data?.data?.items?.map((org: Organization) => ({
              label: org.name,
              value: org._id,
              province_id: org?.province_id?._id,
            }))
          : [],
      };
    },
  });

  // Use the appropriate schema based on user type
  const schema =
    userType === "student"
      ? studentRegistrationSchema
      : citizenRegistrationSchema;

  // Create form with the appropriate type
  const form = useForm<
    StudentRegistrationFormValues | CitizenRegistrationFormValues
  >({
    resolver: zodResolver(schema),
    reValidateMode: "onSubmit",
    mode: "onSubmit",
    defaultValues: {
      last_name: "",
      first_name: "",
      date_of_birth: "",
      username: "",
      password: "",
      confirmPassword: "",
      phone_number: "",
      email: "",
      terms: false,
      ...(userType === "student" ? { organizationId: "" } : {}),
    },
  });

  React.useEffect(() => {
    if (provinces && organizations) {
      const filteredOrganizations = organizations?.filter(
        (org: OrganizationOptions) => org?.province_id === selectProvince,
      );

      setOrganizationsByProvince(filteredOrganizations);
    }
  }, [provinces.length, organizations.length, selectProvince]);

  const handleSubmit = async (
    data: StudentRegistrationFormValues | CitizenRegistrationFormValues,
  ) => {
    setIsSubmitting(true);
    let res;

    try {
      // Simulate API call
      const { provinceId, confirmPassword, terms, ...rest } =
        data as StudentRegistrationFormValues;

      if (!rest.phone_number) delete rest.phone_number;
      if (!rest.email) delete rest.email;
      if (userType === "student") {
        res = await createStudentAccount({
          ...rest,
        }).unwrap();
      } else {
        res = await createCitizenAccount({
          ...rest,
        }).unwrap();
      }

      dispatch(setUserRole(res?.data?.access_token));
      dispatch(setAccessToken(res?.data?.access_token));
      dispatch(setRefreshToken(res?.data?.refresh_token));

      setIsSubmitted(true);
    } catch (err) {
      const detail = (err as any)?.data?.error?.details;
      const message = (err as any)?.data?.error?.message;

      if (detail?.includes("username")) {
        form.setError("username", { message: "Tên tài khoản đã tồn tại" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full bg-white/95 dark:bg-black/30 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0">
        <CardContent className="pt-10 pb-8">
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center text-center"
            initial={{ scale: 0.8, opacity: 0 }}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              Đăng ký thành công!
            </h2>
            <p className="text-gray-600 mb-8 max-w-xs">
              Cảm ơn bạn đã đăng ký. Thông tin của bạn đã được lưu lại thành
              công.
            </p>
            <Button
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-5 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => window.location.reload()}
            >
              Hoàn tất
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white/95 dark:bg-black/30 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0">
      <CardHeader className="pb-4 pt-6">
        <div className="flex items-center">
          <Button size="icon" type="button" variant="ghost" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold text-center text-primary flex-1 mr-8">
            Đăng ký {userType === "student" ? "Học sinh" : "Người dân"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-100 flex gap-2">
                      Họ <p className="text-red-500">*</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nguyễn" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-100 flex gap-2">
                      Tên<p className="text-red-500">*</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Văn A" />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-gray-700 dark:text-gray-100 flex gap-2">
                    Ngày sinh<p className="text-red-500">*</p>
                  </FormLabel>
                  <FormControl>
                    <DateInputForm
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(e) => {
                        field.onChange(e?.toISOString());
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-gray-700 dark:text-gray-100 flex gap-2">
                    Số điện thoại
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập Số điện thoại"
                      type="tel"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-gray-700 dark:text-gray-100 flex gap-2">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập email"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {userType === "student" && (
              <>
                <FormField
                  control={form.control}
                  name="provinceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-100 flex gap-2">
                        Tỉnh / Thành phố
                        <p className="text-red-500">*</p>
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          options={provinces}
                          placeholder="Chọn tỉnh / thành phố"
                          value={field.value ?? ""}
                          onValueChange={(e: string) => {
                            field.onChange(e);
                            setSelectProvince(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="organizationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-gray-100 flex gap-2">
                        Trường<p className="text-red-500">*</p>
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          options={organizationsByProvince}
                          placeholder="Chọn tổ chức"
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-100 flex gap-2">
                    Tên tài khoản<p className="text-red-500">*</p>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="vana" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-100 flex gap-2">
                    Mật khẩu<p className="text-red-500">*</p>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} placeholder="Nhập password" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-100 flex gap-2">
                    Xác nhận mật khẩu<p className="text-red-500">*</p>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} placeholder="xác nhập password" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Checkbox
                        checked={field.value}
                        id="terms"
                        onCheckedChange={field.onChange}
                      />
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="terms"
                      >
                        Chấp nhận các
                        <Link className="text-primary" href="/dieu-khoan">
                          {" "}
                          điều khoản
                        </Link>{" "}
                        và{" "}
                        <Link
                          className="text-primary"
                          href="/chinh-sach-bao-mat"
                        >
                          chính sách bảo mật
                        </Link>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <div className="space-y-3">
              <Button className="w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Đang xử lý..." : "Hoàn tất đăng ký"}
              </Button>
              <Button
                className="w-full"
                disabled={isSubmitting}
                type="button"
                variant="outline"
                onClick={() => router.replace("/dang-nhap")}
              >
                Quay lại đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
