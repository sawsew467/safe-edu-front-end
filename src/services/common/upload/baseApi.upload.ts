import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { getClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";

const baseQuery = fetchBaseQuery({
  baseUrl: constants.API_SERVER,
  prepareHeaders: (headers) => {
    const accessToken = getClientCookie("accessToken");

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: baseQuery,
  endpoints: () => ({}),
});
