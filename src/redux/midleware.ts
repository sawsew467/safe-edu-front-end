import type { Middleware } from "@reduxjs/toolkit";

import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "sonner";

import { deleteClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";
import { setAccessToken, setRefreshToken } from "@/features/auth/slice";

export const rtkQueryErrorLogger: Middleware =
  (store) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const payload = action.payload as { status?: number };
      const statusCode = payload?.status;

      if (statusCode === 401) {
        const refresh_token = store.getState().auth.refresh_token;

        fetch(`${constants.API_SERVER}/auth/get-access-token`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refresh_token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            store.dispatch(setAccessToken(data?.data?.access_token));
            store.dispatch(setRefreshToken(data?.data?.refresh_token));
          })
          .catch((err) => {
            toast.info(JSON.stringify(err));
            deleteClientCookie(constants.USER_INFO);
            deleteClientCookie(constants.ACCESS_TOKEN);
          });
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
    }

    return next(action);
  };
