import { fetchClientApi, parseClientApiPayload } from "@/lib/api/client";
import { parseFeedPage } from "@/lib/feed/parse";
import type { FeedResponse } from "@/types/feed";

export async function getFeedPageFromClientApi(page: number, perPage: number) {
  const response = await fetchClientApi(`/api/feeds?page=${page}&per_page=${perPage}`);
  const payload = await parseClientApiPayload<FeedResponse>(response);

  return parseFeedPage(payload);
}
