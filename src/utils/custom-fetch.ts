import { cookies } from "next/headers";

import constants from "@/settings/constants";

export async function customFetch(url: string, options: RequestInit = {}) {
  const cookie = await cookies();
  const token = cookie.get(constants.ACCESS_TOKEN)?.value || "";
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // if (response.status === 401) {
    //   await refreshToken();

    //   return await fetch(url, config);
    // }
    const res = await response.json();

    return res;
  } catch {}
}

const refreshToken = async () => {
  const cookie = await cookies();
  const refresh_token = cookie.get(constants.REFRESH_TOKEN)?.value || "";

  if (!refresh_token) {
    cookie.delete(constants.ACCESS_TOKEN);
    cookie.delete(constants.USER_INFO);

    return;
  }
  const res = await fetch(`${constants.API_SERVER}/auth/get-access-token`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refresh_token}`,
    },
  });

  if (res.ok) {
    const { data } = await res.json();

    cookie.set(constants.ACCESS_TOKEN, data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });
    cookie.set(constants.REFRESH_TOKEN, data.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return data;
  }
};
