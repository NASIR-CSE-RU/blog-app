"use server";

import { redirect } from "next/navigation";

import { loginWithApi, registerWithApi } from "@/lib/auth/api";
import { setAuthSession } from "@/lib/auth/session";
import type { RegistrationFormState } from "@/types/auth";

const EMPTY_FIELD_MESSAGE = "This field is required.";
const INVALID_EMAIL_MESSAGE = "Enter a valid email address.";
const PASSWORD_MISMATCH_MESSAGE = "Passwords do not match.";
const TERMS_MESSAGE = "You must agree to the terms and conditions.";

export async function registrationAction(
  _prevState: RegistrationFormState,
  formData: FormData,
): Promise<RegistrationFormState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const agreedToTerms = formData.get("terms") === "on";

  const errors: RegistrationFormState["errors"] = {};

  if (!firstName) {
    errors.firstName = EMPTY_FIELD_MESSAGE;
  }

  if (!lastName) {
    errors.lastName = EMPTY_FIELD_MESSAGE;
  }

  if (!email) {
    errors.email = EMPTY_FIELD_MESSAGE;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = INVALID_EMAIL_MESSAGE;
  }

  if (!password) {
    errors.password = EMPTY_FIELD_MESSAGE;
  }

  if (!confirmPassword) {
    errors.confirmPassword = EMPTY_FIELD_MESSAGE;
  } else if (password !== confirmPassword) {
    errors.confirmPassword = PASSWORD_MISMATCH_MESSAGE;
  }

  if (!agreedToTerms) {
    errors.terms = TERMS_MESSAGE;
  }

  if (
    errors.firstName ||
    errors.lastName ||
    errors.email ||
    errors.password ||
    errors.confirmPassword ||
    errors.terms
  ) {
    return { errors };
  }

  try {
    await registerWithApi({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });

    const auth = await loginWithApi({ email, password });
    await setAuthSession(auth.access_token, auth.user, true);
  } catch (error) {
    return {
      errors: {
        form: error instanceof Error ? error.message : "Unable to register right now.",
      },
    };
  }

  redirect("/feeds");
}
