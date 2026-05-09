import { ApiRequestError } from "@/lib/api/errors";
import type { FeedPage, FeedResponse } from "@/types/feed";

export function parseFeedPage(payload: FeedResponse): FeedPage {
  if (!Array.isArray(payload.data) || !payload.meta?.pagination) {
    throw new ApiRequestError(payload.message ?? "Unable to load the feed right now.", payload);
  }

  return {
    posts: payload.data,
    pagination: payload.meta.pagination,
  };
}
