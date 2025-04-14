import type { Middleware } from "@reduxjs/toolkit";

import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "sonner";

import { deleteClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";

export const rtkQueryErrorLogger: Middleware =
  (store) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const payload = action.payload as { status?: number };
      const statusCode = payload?.status;
      const user_role = store.getState().auth.user_role;

      if (statusCode === 401) {
        toast.info("Vui lòng đăng nhập!");
        deleteClientCookie(constants.USER_INFO);
        deleteClientCookie(constants.ACCESS_TOKEN);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
    }

    return next(action);
  };
