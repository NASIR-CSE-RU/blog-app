import "server-only";

import { cookies } from "next/headers";

import { AUTH_TOKEN_COOKIE, AUTH_USER_COOKIE } from "@/lib/auth/constants";
import type { AuthUser } from "@/types/auth";

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

function getCookieOptions(remember: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(remember ? { maxAge: THIRTY_DAYS_IN_SECONDS } : {}),
  };
}

export async function setAuthSession(token: string, user: AuthUser, remember: boolean) {
  const cookieStore = await cookies();

  const cookieOptions = getCookieOptions(remember);

  cookieStore.set(AUTH_TOKEN_COOKIE, token, cookieOptions);
  cookieStore.set(AUTH_USER_COOKIE, JSON.stringify(user), cookieOptions);
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN_COOKIE);
  cookieStore.delete(AUTH_USER_COOKIE);
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null;
}

export async function getAuthUser() {
  const cookieStore = await cookies();
  const serializedUser = cookieStore.get(AUTH_USER_COOKIE)?.value;

  if (!serializedUser) {
    return null;
  }

  try {
    return JSON.parse(serializedUser) as AuthUser;
  } catch {
    return null;
  }
}

export async function isAuthenticated() {
  const token = await getAuthToken();
  const user = await getAuthUser();
  return Boolean(token && user);
}
