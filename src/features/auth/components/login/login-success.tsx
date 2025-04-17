import Image from "next/image";
import { useRouter } from "next-nprogress-bar";

import { Button } from "@/components/ui/button";

export default function LoginSuccess() {
  const router = useRouter();
  const RedirectHome = () => {
    router.push("/");
  };

  return (
    <div className="w-full max-w-md ">
      <div className="bg-white/95 dark:bg-black/30 rounded-lg shadow-lg p-8 mx-4">
        <div className="flex justify-center mb-6">
          <Image
            alt="Phone"
            className="max-h-32 w-auto"
            height={300}
            src="/images/auth/login-success.png"
            width={300}
          />
        </div>

        <h1 className="text-2xl font-bold text-center text-[#8bba34] mb-2">
          Đăng nhập thành công
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Tài khoản của bạn đã được xác nhận thành công
        </p>

        <Button
          className="w-full bg-[#8bba34] hover:bg-[#7aa52c] text-white font-medium py-2 px-4 rounded-md"
          onClick={RedirectHome}
        >
          Tiếp tục vào ứng dụng
        </Button>
      </div>
    </div>
  );
}
