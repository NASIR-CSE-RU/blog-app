import "server-only";

import { clearAuthSession, getAuthToken, getAuthUser } from "@/lib/auth/session";

export async function getAuthenticatedUser() {
  const token = await getAuthToken();
  const user = await getAuthUser();

  if (!token || !user) {
    if (token || user) {
      await clearAuthSession();
    }

    return null;
  }

  return user;
}
