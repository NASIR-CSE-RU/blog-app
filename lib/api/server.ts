import "server-only";

import { redirect } from "next/navigation";

import { clearAuthSession } from "@/lib/auth/session";
import { requireAuthSession } from "@/lib/auth/user";
import { getApiBaseUrl } from "@/lib/env";

type ApiRequestOptions = {
  method?: string;
  body?: BodyInit | null;
  headers?: HeadersInit;
};

export async function fetchAuthenticatedApi(path: string, options: ApiRequestOptions = {}) {
  const { token } = await requireAuthSession();

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: options.method ?? "GET",
    body: options.body,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    await clearAuthSession();
    redirect("/login");
  }

  return response;
}
