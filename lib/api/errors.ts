export type ApiErrorPayload = {
  message?: string;
  errors?: unknown;
} | null;

type ApiErrorPayloadInput = ApiErrorPayload | undefined;

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly payload?: ApiErrorPayload,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

function getApiFieldErrors(payload: ApiErrorPayloadInput) {
  if (
    !payload?.errors ||
    typeof payload.errors !== "object" ||
    Array.isArray(payload.errors)
  ) {
    return undefined;
  }

  const fieldErrors: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(payload.errors as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      const messages = value.filter((item): item is string => typeof item === "string");

      if (messages.length > 0) {
        fieldErrors[key] = messages;
      }
    }
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

export function getApiFieldError(payload: ApiErrorPayloadInput, field: string) {
  return getApiFieldErrors(payload)?.[field]?.[0];
}

export function getApiErrorMessage(payload: ApiErrorPayloadInput) {
  const fieldErrors = getApiFieldErrors(payload);

  if (fieldErrors) {
    for (const messages of Object.values(fieldErrors)) {
      if (messages[0]) {
        return messages[0];
      }
    }
  }

  return payload?.message ?? "Unable to complete the request right now.";
}
