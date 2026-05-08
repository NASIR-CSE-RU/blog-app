"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { ApiRequestError } from "@/lib/api/errors";
import { toggleReactionFromClientApi } from "@/lib/reaction/client";

const LIKE_REACTION_TYPE = 1;

type UseReactionToggleOptions = {
  reactableType: "post" | "comment";
  reactableId: number;
  initialReactionsCount: number;
  initialViewerHasLiked: boolean;
  pendingLabel?: string;
  idleLabel?: string;
  errorMessage?: string;
};

export function useReactionToggle({
  reactableType,
  reactableId,
  initialReactionsCount,
  initialViewerHasLiked,
  pendingLabel = "Working...",
  idleLabel = "Like",
  errorMessage: fallbackErrorMessage = "Unable to update your like right now.",
}: UseReactionToggleOptions) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, startTransition] = useTransition();
  const [hasLiked, setHasLiked] = useState(initialViewerHasLiked);
  const [reactionsCount, setReactionsCount] = useState(initialReactionsCount);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setHasLiked(initialViewerHasLiked);
    setReactionsCount(initialReactionsCount);
  }, [initialReactionsCount, initialViewerHasLiked]);

  async function toggleReaction() {
    if (isSubmitting || isRefreshing) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const previousHasLiked = hasLiked;
    const previousReactionsCount = reactionsCount;
    const nextHasLiked = !previousHasLiked;

    setHasLiked(nextHasLiked);
    setReactionsCount(Math.max(0, previousReactionsCount + (nextHasLiked ? 1 : -1)));

    try {
      const payload = await toggleReactionFromClientApi({
        reactableType,
        reactableId,
        type: LIKE_REACTION_TYPE,
      });

      if (payload.data === null) {
        setHasLiked(false);
        setReactionsCount(Math.max(0, previousReactionsCount - 1));
      } else {
        setHasLiked(true);
        setReactionsCount(previousHasLiked ? previousReactionsCount : previousReactionsCount + 1);
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setHasLiked(previousHasLiked);
      setReactionsCount(previousReactionsCount);
      setErrorMessage(
        error instanceof ApiRequestError
          ? error.message
          : error instanceof Error
            ? error.message
            : fallbackErrorMessage,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    errorMessage,
    hasLiked,
    isPending: isSubmitting || isRefreshing,
    label: isSubmitting || isRefreshing ? pendingLabel : idleLabel,
    reactionsCount,
    toggleReaction,
  };
}
