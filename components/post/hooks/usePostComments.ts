"use client";

import { useEffect, useState } from "react";

import { ApiRequestError } from "@/lib/api/errors";
import { getPostCommentsFromClientApi } from "@/lib/comment/client";
import type { CommentItem } from "@/types/comment";

type UsePostCommentsOptions = {
  postId: number;
  comments: CommentItem[];
};

export function usePostComments({ postId, comments }: UsePostCommentsOptions) {
  const [visibleComments, setVisibleComments] = useState(comments);
  const [hasLoadedAll, setHasLoadedAll] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setVisibleComments(comments);
    setHasLoadedAll(false);
    setLoadError(null);
  }, [comments]);

  async function loadAllComments() {
    if (hasLoadedAll || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    setLoadError(null);

    try {
      const nextComments = await getPostCommentsFromClientApi(postId);

      setVisibleComments(nextComments);
      setHasLoadedAll(true);
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setLoadError(error.message);
      } else {
        setLoadError(error instanceof Error ? error.message : "Unable to load comments right now.");
      }
    } finally {
      setIsLoadingMore(false);
    }
  }

  return {
    hasLoadedAll,
    isLoadingMore,
    loadAllComments,
    loadError,
    visibleComments,
  };
}
