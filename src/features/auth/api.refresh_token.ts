import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { getClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";

const baseQuery = fetchBaseQuery({
  baseUrl: constants.API_SERVER,
  prepareHeaders: (headers) => {
    const refresh_token = getClientCookie(constants.REFRESH_TOKEN);

    headers.set("Content-Type", "application/json");

    if (refresh_token) {
      headers.set("Authorization", `Bearer ${refresh_token}`);
    }

    return headers;
  },
});

const baseApi = createApi({
  baseQuery: baseQuery,
  endpoints: (build) => ({
    getAccessToken: build.mutation({
      query: () => ({
        url: "/auth/get-access-token",
        method: "Get",
      }),
    }),
  }),
});

export const { useGetAccessTokenMutation } = baseApi;
