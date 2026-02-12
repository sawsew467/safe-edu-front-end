import type { Middleware } from "@reduxjs/toolkit";

import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const rtkQueryErrorLogger: Middleware =
  (store) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const payload = action.payload as {
        status?: number;
        data?: { message?: string; error?: { details?: string[] } };
      };
      const statusCode = payload?.status;
      const message = payload?.data?.error?.details
        ? typeof payload.data.error.details === "string"
          ? payload.data.error.details
          : payload.data.error.details.join(", ")
        : payload?.data?.message;

      if (statusCode !== 401)
        toast.error(message || "Có lỗi xảy ra trong quá trình xử lý yêu cầu");
    }

    return next(action);
  };
