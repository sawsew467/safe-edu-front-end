import { cookies } from "next/headers";

import constants from "@/settings/constants";

export async function customFetch(url: string, options: RequestInit = {}) {
  const token = (await cookies()).get(constants.ACCESS_TOKEN)?.value || "";
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  return fetch(url, config);
}
