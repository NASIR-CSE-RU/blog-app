import { ApiRequestError, getApiErrorMessage, type ApiErrorPayload } from "@/lib/api/errors";

type ClientApiOptions = {
  method?: string;
  body?: BodyInit | null;
  headers?: HeadersInit;
};

export async function fetchClientApi(path: string, options: ClientApiOptions = {}) {
  const response = await fetch(path, {
    method: options.method ?? "GET",
    body: options.body,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  return response;
}

export async function parseClientApiPayload<T>(response: Response) {
  const payload = (await response.json().catch(() => null)) as T | null;

  if (!response.ok || payload === null) {
    const errorPayload = payload as ApiErrorPayload;

    throw new ApiRequestError(
      getApiErrorMessage(errorPayload),
      errorPayload,
    );
  }

  return payload;
}
