"use client";

import { useState } from "react";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { useGetProvincesQuery } from "../api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

interface RegistrationFormProps {
  userType: "student" | "citizen";
  phoneNumber: string;
  onBack: () => void;
}

export default function RegistrationForm({
  userType,
  phoneNumber,
  onBack,
}: RegistrationFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { provinces } = useGetProvincesQuery(
    {},
    {
      selectFromResult: ({ data }) => {
        return {
          provinces: data?.data,
        };
      },
    }
  );

  console.log("🚀 ~ provinces:", provinces);

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
    defaultValues: {
      lastName: "",
      firstName: "",
      birthDate: "",
      city: "",
      ...(userType === "student" ? { school: "", grade: "" } : {}),
    },
  });

  const handleSubmit = async (
    data: StudentRegistrationFormValues | CitizenRegistrationFormValues
  ) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full bg-white/95 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0">
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
    <Card className="w-full bg-white/95 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0">
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
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Họ</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nguyễn" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Tên</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Văn A" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-gray-700">Ngày sinh</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-transparent"
                          )}
                          variant={"outline"}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Chọn ngày sinh</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 " />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        initialFocus
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date?.toISOString() ?? "")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label className="text-gray-700" htmlFor="phone">
                Số điện thoại
              </Label>
              <Input readOnly id="phone" value={phoneNumber} />
            </div>

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Tỉnh/Thành phố
                  </FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="hanoi">Hà Nội</SelectItem>
                      <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                      <SelectItem value="danang">Đà Nẵng</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {userType === "student" && (
              <>
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Trường</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trường" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="school1">
                            THPT Ngô Hành Sơn
                          </SelectItem>
                          <SelectItem value="school2">
                            THPT Phan Châu Trinh
                          </SelectItem>
                          <SelectItem value="school3">
                            THPT Hoàng Hoa Thám
                          </SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Lớp</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="12A1" />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Đang xử lý..." : "Hoàn tất đăng ký"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
