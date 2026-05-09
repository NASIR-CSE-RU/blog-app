import "server-only";

import { ApiRequestError } from "@/lib/api/errors";
import { fetchAuthenticatedApi } from "@/lib/api/server";
import { parseFeedPage } from "@/lib/feed/parse";
import type { FeedResponse } from "@/types/feed";

export async function getFeedFromApi(page = 1, perPage = 10) {
  const response = await fetchAuthenticatedApi(`/feeds?page=${page}&per_page=${perPage}`);

  const payload = (await response.json().catch(() => null)) as FeedResponse | null;

  if (!response.ok || !payload?.success) {
    throw new ApiRequestError(payload?.message ?? "Unable to load the feed right now.");
  }

  return parseFeedPage(payload);
}
