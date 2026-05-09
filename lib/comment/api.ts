import "server-only";

import { ApiRequestError, getApiErrorMessage } from "@/lib/api/errors";
import { fetchAuthenticatedApi } from "@/lib/api/server";
import type { ApiResponse } from "@/types/auth";
import type { CommentItem } from "@/types/comment";

type CreateCommentInput = {
  postId: number;
  content: string;
  parentId?: number | null;
};

export async function createCommentFromApi(input: CreateCommentInput) {
  const response = await fetchAuthenticatedApi(`/posts/${input.postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: input.content,
      parent_id: input.parentId ?? null,
    }),
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<CommentItem> | null;

  if (!response.ok || !payload?.success || !payload.data) {
    throw new ApiRequestError(getApiErrorMessage(payload), payload);
  }

  return payload.data;
}
