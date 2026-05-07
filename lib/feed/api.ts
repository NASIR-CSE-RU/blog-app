import "server-only";

import { ApiRequestError } from "@/lib/api/errors";
import { fetchAuthenticatedApi } from "@/lib/api/server";
import type { FeedResponse } from "@/types/feed";

export async function getFeedFromApi() {
  const response = await fetchAuthenticatedApi("/feeds");

  const payload = (await response.json().catch(() => null)) as FeedResponse | null;

  if (!response.ok || !payload?.success || !Array.isArray(payload.data)) {
    throw new ApiRequestError(payload?.message ?? "Unable to load the feed right now.");
  }

  return payload.data;
}
