import "server-only";

import { AuthApiError } from "@/lib/auth/api";
import { fetchAuthenticatedApi } from "@/lib/api/server";
import type { ApiResponse } from "@/types/auth";
import type { FeedPost } from "@/types/feed";

type CreatePostInput = {
  content: string;
  image_url?: string | null;
  visibility: "public" | "private";
};

export async function createPostFromApi(input: CreatePostInput) {
  const response = await fetchAuthenticatedApi("/posts", {
    method: "POST",
    body: JSON.stringify(input),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<FeedPost> | null;

  if (!response.ok || !payload?.success || !payload.data) {
    throw new AuthApiError(payload?.message ?? "Unable to create post right now.");
  }

  return payload.data;
}
