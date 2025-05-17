"use client";

import { useState, useEffect } from "react";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define the form schema with Zod
const formSchema = z.object({
  otp: z.string().min(6, {
    message: "Please enter the complete 6-digit verification code.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function VerifyOtpForm() {
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [mode, setMode] = useState<string>("reset"); // "reset" or "signup"
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);

  //   const supabase = createClientComponentClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize the form with React Hook Form and Zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    // Get email from URL parameters or localStorage
    const emailParam = searchParams.get("email");
    const storedEmail = localStorage.getItem("resetEmail");
    const modeParam = searchParams.get("mode") || "reset";

    setMode(modeParam);
  }, [searchParams, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-primary/80  to-primary/20 dark:from-[#3a5a0e]/40 dark:to-[#3a5a0e]/50 relative overflow-hidden">
      <Card className="w-full max-w-md bg-white/95 dark:bg-black/30 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">Xác minh Email</CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-100">
            Nhập mã xác minh đã gửi đến <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã xác minh</FormLabel>
                    <FormControl>
                      <div className="flex justify-center">
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="w-14 h-14 text-xl" />
                          <InputOTPSlot index={1} className="w-14 h-14 text-xl" />
                          <InputOTPSlot index={2} className="w-14 h-14 text-xl" />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} className="w-14 h-14 text-xl" />
                          <InputOTPSlot index={4} className="w-14 h-14 text-xl" />
                          <InputOTPSlot index={5} className="w-14 h-14 text-xl" />
                        </InputOTPGroup>
                      </InputOTP>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Kiểm tra hộp thư để lấy mã 6 chữ số.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <Button
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    router.replace("dat-lai-mat-khau");
                  }}
                >
                  {form.formState.isSubmitting ? "Đang xác minh..." : "Xác minh mã"}
                </Button>

                <div className="text-center">
                  <Button
                    className="text-sm"
                    disabled={resendDisabled}
                    type="button"
                    variant="ghost"
                  >
                    {resendDisabled
                      ? `Gửi lại mã sau ${countdown}s`
                      : "Không nhận được mã? Gửi lại"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            <Link
              className="text-primary font-medium hover:underline"
              href="/quen-mat-khau"
            >
              Dùng email khác
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
