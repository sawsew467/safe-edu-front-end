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
