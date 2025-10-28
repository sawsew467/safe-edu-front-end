"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { EvidenceFile } from "../report.type";
import {
  AlertLevel,
  calculateAlertLevel,
  getAlertInfo,
} from "../lib/alert-logic";
import {
  GENDER_OPTIONS,
  RELATIONSHIP_OPTIONS,
  VIOLENCE_TYPES,
  LOCATION_OPTIONS,
  TIME_OPTIONS,
  IMPACT_LEVEL_OPTIONS,
  CURRENT_SITUATION_OPTIONS,
  INFORMATION_SOURCES,
  RELIABILITY_OPTIONS,
  CONTACT_PREFERENCES,
} from "../report.data";
import { ReportFormSchema, reportSchema } from "../report.schema";
import { useCreateReportMutation } from "../report.user.api";

import { EvidenceUploader } from "./EvidenceUploader";
import { EmergencyModal } from "./EmergencyModal";
import { SuccessModal } from "./SuccessModal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SelectOrganization from "@/components/ui/selectOrganization";
import { useGetUserQuery } from "@/features/users/api/student.api";

export function ReportForm() {
  const reportSchemaWithRefine = reportSchema.refine(
    (data) => {
      if (data.contact_option && data.contact_info === "external_email") {
        return Boolean(
          data.external_contact_info &&
            data.external_contact_info.trim().length > 0,
        );
      }

      return true;
    },
    {
      message: "Vui lòng cung cấp thông tin liên hệ khi chọn tùy chọn liên hệ",
      path: ["external_contact_info"],
    },
  );

  const form = useForm<ReportFormSchema>({
    resolver: zodResolver(reportSchemaWithRefine),
    defaultValues: {
      gender: "Male",
      relationship_to_victim: "Same class",
      violence_types: [],
      location: "In classroom",
      time_of_incident: "Today",
      impact_level: "Mild",
      current_situation: "Ended",
      information_sources: [],
      information_reliability: "Certain",
      contact_option: false,
      class_grade: "",
      organizationId: "",
    },
  });

  const { control, handleSubmit, watch, setValue, getValues } = form;

  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [alertLevel, setAlertLevel] = useState<AlertLevel | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdReportId, setCreatedReportId] = useState<string>("");

  const [createReport, { isLoading: isSubmitting }] = useCreateReportMutation();

  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data }) => ({ user: data?.data }),
  });

  const watched = watch();
  const watchedImpact = watched.impact_level;
  const watchedSituation = watched.current_situation;
  const watchedContactInfo = watched.contact_info;

  useEffect(() => {
    if (!watched.contact_option) return;

    if (user) {
      setValue("contact_info", "");
    } else {
      setValue("contact_info", "external_email");
    }
  }, [user, watched.contact_option]);

  useEffect(() => {
    if (watchedImpact && watchedSituation) {
      const level = calculateAlertLevel(
        watchedImpact,
        watchedSituation,
        evidenceFiles.length > 0,
      );

      setAlertLevel(level);
    }
  }, [watchedImpact, watchedSituation, evidenceFiles.length]);

  const updateFormData = (
    field: keyof z.infer<typeof reportSchemaWithRefine>,
    value: any,
  ) => {
    setValue(field as any, value);
  };

  const onSubmit = async (values: ReportFormSchema) => {
    if (alertLevel === 4) {
      setShowEmergencyModal(true);

      return;
    }

    await submitReport(values);
  };

  const submitReport = async (values?: ReportFormSchema) => {
    try {
      const payloadValues = values ?? getValues();

      const reportPayload: any = {
        victim_name: payloadValues.victim_name,
        class_grade: payloadValues.class_grade,
        gender: payloadValues.gender,
        relationship_to_victim: payloadValues.relationship_to_victim,
        relationship_other: payloadValues.relationship_other,
        violence_types: payloadValues.violence_types,
        violence_other: payloadValues.violence_other,
        location: payloadValues.location,
        location_other: payloadValues.location_other,
        time_of_incident: payloadValues.time_of_incident,
        impact_level: payloadValues.impact_level,
        current_situation: payloadValues.current_situation,
        information_sources: payloadValues.information_sources,
        information_reliability: payloadValues.information_reliability,
        contact_option: payloadValues.contact_option,
        contact_info: payloadValues.contact_info,
        external_contact_info: payloadValues.external_contact_info,
        organizationId: payloadValues.organizationId,
        has_evidence: evidenceFiles.length > 0,
        alert_level: alertLevel,
        evidence: evidenceFiles.map((f) => f.preview), // URLs of uploaded files
      };

      const result = await createReport(reportPayload).unwrap();

      setCreatedReportId(result?.data?.id);
      setShowEmergencyModal(false);
      setShowSuccessModal(true);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Gửi báo cáo thất bại. Vui lòng thử lại.",
      );
      setShowEmergencyModal(false);
    }
  };

  return (
    <>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-3xl mx-auto shadow-lg bg-white/80 dark:bg-background backdrop-blur">
          <CardHeader>
            <motion.div
              animate={{ scale: 1 }}
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl text-center">
              Phản ánh bạo lực học đường ẩn danh
            </CardTitle>
            <CardDescription className="text-center">
              Sự an toàn của bạn là quan trọng. Báo cáo các sự việc một cách ẩn
              danh và giúp tạo ra một môi trường học đường an toàn hơn.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <SelectOrganization control={control} />

                <div className="space-y-2">
                  <Label
                    className="text-gray-700 dark:text-gray-100"
                    htmlFor="victim_name"
                  >
                    Tên nạn nhân (nếu biết)
                  </Label>
                  <Input
                    className="focus-visible:ring-blue-500"
                    id="victim_name"
                    placeholder="Để trống để giữ hoàn toàn ẩn danh"
                    value={watched.victim_name || ""}
                    onChange={(e) =>
                      updateFormData("victim_name", e.target.value)
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Tất cả thông tin được mã hóa và bảo vệ
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormField
                      control={control}
                      name="class_grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="!flex !items-center gap-2 text-gray-700 dark:text-gray-100">
                            Lớp / Khối <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              required
                              id="class_grade"
                              placeholder="VD: Lớp 10A3, Khối 12"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-100">
                      Giới tính <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={watched.gender}
                      onValueChange={(value) => updateFormData("gender", value)}
                    >
                      <div className="flex gap-4">
                        {GENDER_OPTIONS.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              id={`gender-${option.value}`}
                              value={option.value}
                            />
                            <Label
                              className="font-normal cursor-pointer text-gray-800 dark:text-gray-200"
                              htmlFor={`gender-${option.value}`}
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-100">
                    Mức độ thân quen của bạn với nạn nhân{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watched.relationship_to_victim}
                    onValueChange={(value) =>
                      updateFormData("relationship_to_victim", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIP_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {watched.relationship_to_victim === "Other" && (
                    <motion.div
                      animate={{ opacity: 1, height: "auto" }}
                      initial={{ opacity: 0, height: 0 }}
                    >
                      <Input
                        className="mt-2"
                        placeholder="Vui lòng ghi rõ"
                        value={watched.relationship_other || ""}
                        onChange={(e) =>
                          updateFormData("relationship_other", e.target.value)
                        }
                      />
                    </motion.div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700 dark:text-gray-100">
                    Hình thức bạo lực muốn phản ánh{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <FormField
                    control={control}
                    name="violence_types"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-2">
                          {VIOLENCE_TYPES.map((type) => (
                            <motion.div
                              key={type.value}
                              className="flex items-center space-x-2"
                              whileHover={{ x: 2 }}
                            >
                              <Checkbox
                                checked={field.value?.includes(type.value)}
                                id={`violence-${type.value}`}
                                onCheckedChange={() => {
                                  const current = field.value ?? [];
                                  const next = current.includes(type.value)
                                    ? current.filter(
                                        (i: string) => i !== type.value,
                                      )
                                    : [...current, type.value];

                                  field.onChange(next);
                                }}
                              />
                              <Label
                                className="font-normal cursor-pointer"
                                htmlFor={`violence-${type.value}`}
                              >
                                {type.label}
                              </Label>
                            </motion.div>
                          ))}
                        </div>
                        <FormMessage className="text-red-600 dark:text-red-400 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                  {watched.violence_types?.includes("Other") && (
                    <motion.div
                      animate={{ opacity: 1, height: "auto" }}
                      initial={{ opacity: 0, height: 0 }}
                    >
                      <Input
                        className="mt-2"
                        placeholder="Vui lòng ghi rõ hành vi khác"
                        value={watched.violence_other || ""}
                        onChange={(e) =>
                          updateFormData("violence_other", e.target.value)
                        }
                      />
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-100">
                    Địa điểm xảy ra <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={watched.location}
                    onValueChange={(value) => updateFormData("location", value)}
                  >
                    <div className="space-y-2">
                      {LOCATION_OPTIONS.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            id={`location-${option.value}`}
                            value={option.value}
                          />
                          <Label
                            className="font-normal cursor-pointer"
                            htmlFor={`location-${option.value}`}
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                  {watched.location === "Outside school" && (
                    <motion.div
                      animate={{ opacity: 1, height: "auto" }}
                      initial={{ opacity: 0, height: 0 }}
                    >
                      <Input
                        className="mt-2"
                        placeholder="Vui lòng ghi rõ địa điểm"
                        value={watched.location_other || ""}
                        onChange={(e) =>
                          updateFormData("location_other", e.target.value)
                        }
                      />
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-100">
                      Thời điểm gần nhất xảy ra
                    </Label>
                    <Select
                      value={watched.time_of_incident}
                      onValueChange={(value) =>
                        updateFormData("time_of_incident", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-100">
                      Mức độ ảnh hưởng đến nạn nhân
                    </Label>
                    <Select
                      value={watched.impact_level}
                      onValueChange={(value) =>
                        updateFormData("impact_level", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {IMPACT_LEVEL_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-100">
                    Tình trạng hiện tại của vụ việc
                  </Label>
                  <Select
                    value={watched.current_situation}
                    onValueChange={(value) =>
                      updateFormData("current_situation", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENT_SITUATION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700 dark:text-gray-100">
                    Nguồn thông tin <span className="text-red-500">*</span>
                  </Label>
                  <FormField
                    control={control}
                    name="information_sources"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-2">
                          {INFORMATION_SOURCES.map((source) => (
                            <motion.div
                              key={source.value}
                              className="flex items-center space-x-2"
                              whileHover={{ x: 2 }}
                            >
                              <Checkbox
                                checked={field.value?.includes(source.value)}
                                id={`source-${source.value}`}
                                onCheckedChange={() => {
                                  const current = field.value ?? [];
                                  const next = current.includes(source.value)
                                    ? current.filter(
                                        (i: string) => i !== source.value,
                                      )
                                    : [...current, source.value];

                                  field.onChange(next);
                                }}
                              />
                              <Label
                                className="font-normal cursor-pointer"
                                htmlFor={`source-${source.value}`}
                              >
                                {source.label}
                              </Label>
                            </motion.div>
                          ))}
                        </div>
                        <FormMessage className="text-red-600 dark:text-red-400 text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-100">
                    Mức độ tin cậy của thông tin
                  </Label>
                  <RadioGroup
                    value={watched.information_reliability}
                    onValueChange={(value) =>
                      updateFormData("information_reliability", value)
                    }
                  >
                    <div className="flex gap-4">
                      {RELIABILITY_OPTIONS.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            id={`reliability-${option.value}`}
                            value={option.value}
                          />
                          <Label
                            className="font-normal cursor-pointer"
                            htmlFor={`reliability-${option.value}`}
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-100">
                    Bằng chứng (tùy chọn)
                  </Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Tải lên ảnh, video hoặc ảnh chụp màn hình (tối đa 10MB mỗi
                    file)
                  </p>
                  <EvidenceUploader
                    files={evidenceFiles}
                    onChange={setEvidenceFiles}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700 dark:text-gray-100">
                    Thông tin hỗ trợ
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={watched.contact_option}
                      id="contact-option"
                      onCheckedChange={(checked) =>
                        updateFormData("contact_option", checked === true)
                      }
                    />
                    <Label
                      className="font-normal cursor-pointer text-gray-800 dark:text-gray-200"
                      htmlFor="contact-option"
                    >
                      Tôi muốn Nhà trường giữ liên hệ bí mật để xác minh thêm
                    </Label>
                  </div>
                  {watched.contact_option && (
                    <FormField
                      control={control}
                      name="contact_info"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <motion.div
                              animate={{ opacity: 1, height: "auto" }}
                              initial={{ opacity: 0, height: 0 }}
                            >
                              {user ? (
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <div className="flex flex-col gap-2">
                                    {CONTACT_PREFERENCES.map((option) => (
                                      <div
                                        key={option.value}
                                        className="flex items-center space-x-2"
                                      >
                                        <RadioGroupItem
                                          id={`reliability-${option.value}`}
                                          value={option.value}
                                        />
                                        <Label
                                          className="font-normal cursor-pointer"
                                          htmlFor={`reliability-${option.value}`}
                                        >
                                          {option.label}
                                        </Label>
                                      </div>
                                    ))}
                                    {watchedContactInfo ===
                                      "external_email" && (
                                      <FormField
                                        control={control}
                                        name="external_contact_info"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormControl>
                                              <Input
                                                className="mt-2"
                                                placeholder="Email của bạn"
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                              />
                                            </FormControl>
                                            <FormMessage className="text-red-500 text-sm" />
                                          </FormItem>
                                        )}
                                      />
                                    )}
                                  </div>
                                </RadioGroup>
                              ) : (
                                <FormField
                                  control={control}
                                  name="external_contact_info"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          className="mt-2"
                                          placeholder="Email của bạn"
                                          value={field.value || ""}
                                          onChange={field.onChange}
                                        />
                                      </FormControl>
                                      <FormMessage className="text-red-500 text-sm" />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </motion.div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground text-center mb-4">
                    <ShieldCheck className="h-3 w-3 inline mr-1" />
                    Tất cả thông tin được mã hóa và bảo vệ. Nếu bạn chọn ẩn danh
                    hoàn toàn, thông tin liên hệ của bạn sẽ không được lưu trữ.
                  </p>
                  <Button
                    className="w-full h-12 text-base"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Đang gửi báo cáo...
                      </>
                    ) : (
                      "Gửi báo cáo"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      <EmergencyModal
        open={showEmergencyModal}
        onCancel={() => setShowEmergencyModal(false)}
        onConfirm={handleSubmit(submitReport)}
      />

      {alertLevel && (
        <SuccessModal
          alertInfo={getAlertInfo(alertLevel)}
          open={showSuccessModal}
          reportId={createdReportId}
          onClose={() => {
            setShowSuccessModal(false);
            form.reset();
            setEvidenceFiles([]);
            setCreatedReportId("");
          }}
        />
      )}
    </>
  );
}
