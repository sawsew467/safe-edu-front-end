import { cookies } from "next/headers";

export async function customFetch(url: string, options: RequestInit = {}) {
  const token = (await cookies()).get("_access_token")?.value || "";
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
