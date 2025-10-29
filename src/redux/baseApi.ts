import {
  createApi,
  fetchBaseQuery,
  BaseQueryApi,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";

import { deleteClientCookie, getClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";
import { setAccessToken, setRefreshToken } from "@/features/auth/slice";

const baseQuery = fetchBaseQuery({
  baseUrl: constants.API_SERVER,
  prepareHeaders: (headers) => {
    const accessToken = getClientCookie(constants.ACCESS_TOKEN);

    headers.set("Content-Type", "application/json");

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

export const baseQueryWithReauth: typeof baseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {},
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refresh_token = (api!.getState() as any)?.auth.refresh_token;

    const refreshResult = await fetch(
      `${constants.API_SERVER}/auth/get-access-token`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${refresh_token}`,
          "Content-Type": "application/json",
        },
      },
    ).then((res) => res.json());

    const newAccessToken = refreshResult?.data?.access_token;
    const newRefreshToken = refreshResult?.data?.refresh_token;

    if (newAccessToken) {
      api.dispatch(setAccessToken(newAccessToken));
      api.dispatch(setRefreshToken(newRefreshToken));

      // Retry original request with new token
      result = await baseQuery(args, api, extraOptions);
      if (result?.error?.status === 401) {
        deleteClientCookie(constants.ACCESS_TOKEN);
        deleteClientCookie(constants.REFRESH_TOKEN);
      }
    } else {
      deleteClientCookie(constants.ACCESS_TOKEN);
      deleteClientCookie(constants.REFRESH_TOKEN);

      return { error: { status: 401, data: "Unauthorized" } };
    }
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    "Librarys",
    "Topics",
    "News",
    "Admin",
    "Supervisions",
    "Manager",
    "Organizations",
    "students",
    "citizens",
    "Competitions",
    "Quizz",
    "Question",
    "Picture",
    "Comment",
    "Reports",
  ],
});
