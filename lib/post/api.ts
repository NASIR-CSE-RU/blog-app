import "server-only";

import { fetchAuthenticatedApi } from "@/lib/api/server";
import { ApiRequestError, getApiErrorMessage } from "@/lib/api/errors";
import type { ApiResponse } from "@/types/auth";
import type { FeedPost } from "@/types/feed";

type CreatePostInput = {
  content: string;
  image?: File | null;
  visibility: "public" | "private";
};

export async function createPostFromApi(input: CreatePostInput) {
  const formData = new FormData();
  formData.set("content", input.content);
  formData.set("visibility", input.visibility);

  if (input.image) {
    formData.set("image", input.image);
  }

  const response = await fetchAuthenticatedApi("/posts", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<FeedPost> | null;

  if (!response.ok || !payload?.success || !payload.data) {
    throw new ApiRequestError(getApiErrorMessage(payload), payload);
  }

  return payload.data;
}
