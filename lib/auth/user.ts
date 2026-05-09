import "server-only";

import { clearAuthSession, getAuthToken, getAuthUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function requireAuthSession() {
  const token = await getAuthToken();
  const user = await getAuthUser();

  if (!token || !user) {
    if (token || user) {
      await clearAuthSession();
    }

    redirect("/login");
  }

  return { token, user };
}

export async function getAuthenticatedUser() {
  const session = await requireAuthSession();
  return session.user;
}
