"use server";

import { redirect } from "next/navigation";

import { loginWithApi } from "@/lib/auth/api";
import { setAuthSession } from "@/lib/auth/session";
import type { LoginFormState } from "@/types/auth";

const EMPTY_FIELD_MESSAGE = "This field is required.";
const DEFAULT_REDIRECT_PATH = "/feeds";
const INVALID_EMAIL_MESSAGE = "Enter a valid email address.";

function getRedirectPath(value: FormDataEntryValue | null) {
  const path = String(value ?? "").trim();

  if (!path.startsWith("/") || path.startsWith("//")) {
    return DEFAULT_REDIRECT_PATH;
  }

  return path;
}

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";
  const redirectTo = getRedirectPath(formData.get("redirectTo"));

  const errors: LoginFormState["errors"] = {};

  if (!email) {
    errors.email = EMPTY_FIELD_MESSAGE;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = INVALID_EMAIL_MESSAGE;
  }

  if (!password) {
    errors.password = EMPTY_FIELD_MESSAGE;
  }

  if (errors.email || errors.password) {
    return { errors };
  }

  try {
    const auth = await loginWithApi({ email, password });
    await setAuthSession(auth.access_token, auth.user, remember);
  } catch (error) {
    return {
      errors: {
        form: error instanceof Error ? error.message : "Unable to login right now.",
      },
    };
  }

  redirect(redirectTo);
}
