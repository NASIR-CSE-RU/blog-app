import { NextResponse } from "next/server";

import { getAuthToken } from "@/lib/auth/session";
import { getApiBaseUrl } from "@/lib/env";

type ForwardApiOptions = {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  unauthorizedMessage?: string;
  fallbackErrorMessage?: string;
};

function errorJson(message: string, status: number) {
  return NextResponse.json(
    {
      success: false,
      message,
      data: null,
      errors: null,
    },
    { status },
  );
}

export function invalidRouteParam(message = "Invalid request.") {
  return errorJson(message, 400);
}

export async function forwardAuthenticatedApiRoute(
  path: string,
  options: ForwardApiOptions = {},
) {
  const token = await getAuthToken();

  if (!token) {
    return errorJson(options.unauthorizedMessage ?? "Unauthorized", 401);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    body: options.body,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (payload === null) {
    return errorJson(
      options.fallbackErrorMessage ?? "Unable to complete the request right now.",
      response.status || 500,
    );
  }

  return NextResponse.json(payload, { status: response.status });
}
