"use client";
import type { Province } from "../../user.types";
import type { Organization } from "@/features/organizations/types";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next-nprogress-bar";
import React, { useState, useRef } from "react";
import {
  Camera,
  Pencil,
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  MapPin,
} from "lucide-react";

import {
  useGetUserQuery,
  useUpdateProfileMutation,
} from "../../api/student.api";
import { formStudentSchema } from "../../user.schema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TitlePage from "@/components/ui/title-page";
import useBreadcrumb from "@/hooks/useBreadcrumb";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllOrganizationQuery } from "@/features/organizations/organization.api";
import { DateTimeInput } from "@/components/ui/datetime-input";
import { Combobox } from "@/components/ui/comboBox";
import { useGetProvincesQuery } from "@/features/auth/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useUploadImageMutation } from "@/services/common/upload/api.upload";
import { setClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";

const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  organization: "",
};

const formUpdateStudentSchema = formStudentSchema.extend({
  provinceId: z
    .union([
      z.string({ message: "Đây là trường bắt buộc" }),
      z.null(),
      z.literal(""),
    ])
    .optional(),
  organizationId: z
    .union([
      z.string({ message: "Đây là trường bắt buộc" }),
      z.null(),
      z.literal(""),
    ])
    .optional(),
  avatar: z.optional(z.string()),
});

type OrganizationOptions = {
  label: string;
  value: string;
  province_id?: string;
};

export default function UpdateProfileModule() {
  const router = useRouter();
  const [organizationsByProvince, setOrganizationsByProvince] = React.useState<
    any[]
  >([]);
  const [selectedProvince, setSelectedProvince] = React.useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user_role } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("personal");

  useBreadcrumb([
    {
      label: "Học sinh",
      href: "/quan-tri/nguoi-dung?tab=student",
    },
    {
      label: "Thay đổi hồ sơ",
    },
  ]);

  const [updateStudent] = useUpdateProfileMutation();
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: data?.data,
    }),
  });

  const { provinces }: { provinces: Array<{ label: string; value: string }> } =
    useGetProvincesQuery(
      {},
      {
        selectFromResult: ({ data }) => {
          return {
            provinces: data?.data
              ? data?.data?.items?.map((province: Province) => ({
                label: province?.name,
                value: province?._id,
              }))
              : [],
          };
        },
      }
    );

  const { organizations } = useGetAllOrganizationQuery(undefined, {
    skip: !provinces,
    selectFromResult: ({ data }) => {
      return {
        organizations: data?.data
          ? data?.data?.items?.map((org: Organization) => ({
            label: org?.name,
            value: org?._id,
            province_id: org?.province_id?._id,
          }))
          : [],
      };
    },
  });

  const form = useForm<z.infer<typeof formUpdateStudentSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formUpdateStudentSchema),
    defaultValues: initialForm,
  });

  React.useEffect(() => {
    if (provinces && organizations) {
      const filteredOrganizations = organizations?.filter(
        (org: OrganizationOptions) => org?.province_id === selectedProvince
      );

      setOrganizationsByProvince(filteredOrganizations);
    }
  }, [provinces?.length, organizations?.length, selectedProvince]);

  const handleBack = () => {
    router.replace("/trang-ca-nhan");
  };

  React.useEffect(() => {
    if (user) {
      form.setValue("first_name", user?.first_name);
      form.setValue("last_name", user?.last_name);
      form.setValue("email", user?.email);
      form.setValue("phone_number", user?.phone_number);
      form.setValue(
        "date_of_birth",
        user?.date_of_birth ? new Date(user?.date_of_birth) : new Date()
      );
      form.setValue("avatar", user?.avatar);

      form.setValue("organizationId", user?.organizationId?._id);

      const province_id = user?.organizationId?.province_id;

      if (province_id) {
        form.setValue("provinceId", province_id);
        setSelectedProvince(province_id);
      }
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.type.startsWith("image/")) {
        const formData = new FormData();

        formData.append("file", file);
        const { data } = await uploadImage(formData);

        form.setValue("avatar", data?.data?.data);
      } else {
        toast.error("Vui lòng chọn một tệp hình ảnh hợp lệ.");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  async function onSubmit(data: z.infer<typeof formUpdateStudentSchema>) {
    const toastId = toast.loading("Đang cập nhật hồ sơ...");
    const { email, phone_number, organizationId, avatar } = data;

    delete data.provinceId;
    if (!email) delete data.email;
    if (!phone_number) delete data.phone_number;
    if (!organizationId) delete data.organizationId;
    if (!avatar) delete data.avatar;
    try {
      // Create FormData if avatar is present
      const user = await updateStudent({
        ...data,
        date_of_birth: data?.date_of_birth?.toISOString(),
      }).unwrap();
      const { avatar, achievements, first_name, last_name, username } =
        user?.data;

      setClientCookie(
        constants.USER_INFO,
        JSON.stringify({
          avatar,
          achievements,
          first_name,
          last_name,
          username,
        })
      );
      toast.success("Cập nhật hồ sơ thành công", { id: toastId });
    } catch (error) {
      toast.error("Cập nhật hồ sơ thất bại", { id: toastId });
    }
  }

  const getInitials = (firstName = "", lastName = "") => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <TitlePage title="Thay đổi hồ sơ" />
      </div>

      <Card className="mb-6 shadow-sm border-muted/60 overflow-hidden">
        <CardHeader className="bg-muted/20 pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <User className="h-5 w-5 text-primary" />
            Thông tin cá nhân
          </CardTitle>
          <CardDescription>
            Cập nhật thông tin cá nhân và ảnh đại diện của bạn
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <CardContent className="md:p-6 p-2">
                <TabsContent className="mt-0 pt-4 space-y-4" value="personal">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex flex-col items-center space-y-4 w-full md:w-auto">
                      <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative group w-36">
                                <Avatar className="w-36 h-36 border-4 border-muted/60 shadow-md">
                                  <AvatarImage
                                    className="object-cover"
                                    src={field?.value || ""}
                                  />
                                  {!isLoading ? (
                                    <div className="w-full h-full flex items-center justify-center bg-muted/20">
                                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                                    </div>
                                  ) : (
                                    <AvatarFallback>
                                      {getInitials(
                                        form.getValues("first_name"),
                                        form.getValues("last_name")
                                      )}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <button
                                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  type="button"
                                  onClick={handleAvatarClick}
                                >
                                  <Camera className="h-8 w-8 text-white" />
                                </button>

                                <input
                                  ref={fileInputRef}
                                  accept="image/*"
                                  className="hidden"
                                  type="file"
                                  onChange={handleFileChange}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex-1 w-full space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-base font-medium">
                                <User className="h-4 w-4 text-muted-foreground" />
                                Họ
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="rounded-lg"
                                  placeholder="Nhập họ..."
                                  type="text"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Nhập họ của bạn
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-base font-medium">
                                <User className="h-4 w-4 text-muted-foreground" />
                                Tên
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="rounded-lg"
                                  placeholder="Nhập tên..."
                                  type="text"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Nhập tên của bạn
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="date_of_birth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-base font-medium">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                Ngày sinh
                              </FormLabel>
                              <FormControl>
                                <DateTimeInput
                                  className="rounded-lg"
                                  format="dd/MM/yyyy"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Ngày sinh của bạn
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2 text-base font-medium">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                Số điện thoại
                              </FormLabel>
                              <FormControl>
                                <PhoneInput
                                  className="rounded-lg"
                                  placeholder="Nhập số điện thoại..."
                                  {...field}
                                  defaultCountry="VN"
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Số điện thoại hiện tại của bạn
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="flex items-center gap-2 text-base font-medium">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="rounded-lg"
                                  placeholder="Nhập email..."
                                  type="email"
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Email liên hệ của bạn
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {user_role?.role === "Student" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6">
                          <FormField
                            control={form.control}
                            name="provinceId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-base font-medium">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  Tỉnh / Thành phố
                                  <span className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Combobox
                                    className="rounded-lg"
                                    options={provinces}
                                    placeholder="Chọn tỉnh / thành phố"
                                    value={field.value ?? ""}
                                    onValueChange={(e: string) => {
                                      field.onChange(e);
                                      setSelectedProvince(e);
                                      // Reset organization when province changes
                                      form.setValue("organizationId", "");
                                    }}
                                  />
                                </FormControl>
                                <FormDescription className="text-xs">
                                  Chọn tỉnh/thành phố của bạn
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="organizationId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2 text-base font-medium">
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                  Trường
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    disabled={!selectedProvince}
                                    {...field}
                                    value={field.value ?? ""}
                                    onValueChange={(e) => {
                                      if (e) field.onChange(e);
                                    }}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="rounded-lg">
                                        <SelectValue
                                          placeholder={
                                            selectedProvince
                                              ? "Chọn trường"
                                              : "Vui lòng chọn tỉnh/thành phố trước"
                                          }
                                        />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {organizationsByProvince?.length > 0 ? (
                                        organizationsByProvince?.map(
                                          ({
                                            label,
                                            value,
                                          }: {
                                            label: string;
                                            value: string;
                                          }) => (
                                            <SelectItem
                                              key={value}
                                              value={value}
                                            >
                                              {label}
                                            </SelectItem>
                                          )
                                        )
                                      ) : (
                                        <div className="p-2 text-center text-muted-foreground">
                                          Không có trường nào trong khu vực này
                                        </div>
                                      )}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormDescription className="text-xs">
                                  Chọn trường của bạn
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </CardContent>

              <CardFooter className="flex justify-end gap-4 p-6 pt-2 bg-muted/10">
                <Button
                  className="rounded-lg px-5"
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                >
                  Thoát
                </Button>
                <Button
                  className="rounded-lg px-5 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  type="submit"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Cập nhật hồ sơ
                </Button>
              </CardFooter>
            </Tabs>
          </form>
        </Form>
      </Card>
    </div>
  );
}
