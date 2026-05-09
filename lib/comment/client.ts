import { fetchClientApi, parseClientApiPayload } from "@/lib/api/client";
import { ApiRequestError } from "@/lib/api/errors";
import type { CommentItem, CommentResponse } from "@/types/comment";

export async function getPostCommentsFromClientApi(postId: number) {
  const response = await fetchClientApi(`/api/posts/${postId}/comments`);
  const payload = await parseClientApiPayload<CommentResponse>(response);

  if (!payload.success || !Array.isArray(payload.data)) {
    throw new ApiRequestError(payload.message ?? "Unable to load comments right now.", payload);
  }

  return payload.data as CommentItem[];
}
