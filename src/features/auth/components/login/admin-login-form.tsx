"use client";

import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useLoginWithGoogleMutation } from "@/features/auth/api";
import {
  setAccessToken,
  setOrganizationList,
  setRefreshToken,
  setUserInfo,
  setUserRole,
} from "@/features/auth/slice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth, provider } from "@/services/firebase/config";
import { setClientCookie } from "@/lib/jsCookies";
import { useAppDispatch } from "@/hooks/redux-toolkit";
import constants from "@/settings/constants";

export function LoginForm() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [signInWithGoogle] = useLoginWithGoogleMutation();

  const handleGoogleLogin = async () => {
    try {
      const resFirebase: any = await signInWithPopup(
        auth,
        provider.providerGoogle
      );

      const res = await signInWithGoogle({
        token: resFirebase.user.accessToken,
      }).unwrap();

      console.log("🚀 ~ handleGoogleLogin ~ res:", res);

      const firebaseUser = {
        email: resFirebase.user.email,
        displayName: resFirebase.user.displayName,
        photoURL: resFirebase.user.photoURL,
      };

      setClientCookie(constants.USER_INFO, JSON.stringify(firebaseUser));
      dispatch(setUserInfo(firebaseUser));
      dispatch(setUserRole(res?.data?.accessToken));
      dispatch(setAccessToken(res?.data?.accessToken));
      dispatch(setRefreshToken(res?.data?.refreshToken));
      dispatch(setOrganizationList(res?.data?.organizations || []));

      if (res?.data?.role === "Manager") {
        router.push("/quan-tri/to-chuc/" + res?.data?.organizations?.[0]?.id);
        return;
      }

      router.push("/quan-tri");
    } catch (error: any) {
      if (error?.status === 404) {
        toast.error("Tài khoản của bạn chưa có trong hệ thống quản trị");
      }
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email của bạn bên dưới để đăng nhập vào trang quản trị của
          SafeEdu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              required
              id="email"
              placeholder="m@example.com"
              type="email"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Mật khẩu</Label>
              <Link className="ml-auto inline-block text-sm underline" href="#">
                Quên mật khẩu?
              </Link>
            </div>
            <Input required id="password" type="password" />
          </div>
          <Button disabled className="w-full cursor-pointer" type="submit">
            Đăng nhập
          </Button> */}
          <Button
            className="w-full"
            variant="outline"
            onClick={handleGoogleLogin}
          >
            Đăng nhập với Google
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
