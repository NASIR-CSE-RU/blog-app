import "server-only";

import { getApiBaseUrl } from "@/lib/env";
import { ApiRequestError, getApiErrorMessage } from "@/lib/api/errors";
import type { ApiResponse, AuthUser, LoginPayload } from "@/types/auth";

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export async function loginWithApi({ email, password }: LoginInput) {
  const response = await fetch(`${getApiBaseUrl()}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<LoginPayload> | null;

  if (!response.ok || !payload?.success || !payload.data?.access_token) {
    throw new ApiRequestError(getApiErrorMessage(payload));
  }

  return payload.data;
}

export async function registerWithApi(input: RegisterInput) {
  const response = await fetch(`${getApiBaseUrl()}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<AuthUser> | null;

  if (!response.ok || !payload?.success || !payload.data) {
    throw new ApiRequestError(getApiErrorMessage(payload));
  }

  return payload.data;
}

export async function getCurrentUserFromApi(token: string) {
  const response = await fetch(`${getApiBaseUrl()}/user`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as AuthUser | null;

  if (!response.ok || !payload?.id) {
    throw new ApiRequestError("Unable to load the authenticated user.");
  }

  return payload;
}
