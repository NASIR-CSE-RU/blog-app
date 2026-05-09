import { fetchClientApi, parseClientApiPayload } from "@/lib/api/client";
import { ApiRequestError } from "@/lib/api/errors";
import type { ApiResponse } from "@/types/auth";
import type { ToggleReactionResult } from "@/types/reaction";

type ToggleReactionInput = {
  reactableType: "post" | "comment";
  reactableId: number;
  type: number;
};

export async function toggleReactionFromClientApi(input: ToggleReactionInput) {
  const response = await fetchClientApi("/api/reactions/toggle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reactable_type: input.reactableType,
      reactable_id: input.reactableId,
      type: input.type,
    }),
  });

  const payload = await parseClientApiPayload<ApiResponse<ToggleReactionResult>>(response);

  if (!payload.success) {
    throw new ApiRequestError(payload.message ?? "Unable to update your like right now.", payload);
  }

  return payload;
}
