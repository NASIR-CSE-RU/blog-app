"use server";

import { revalidatePath } from "next/cache";

import { ApiRequestError, getApiFieldError } from "@/lib/api/errors";
import { createCommentFromApi } from "@/lib/comment/api";
import { createPostFromApi } from "@/lib/post/api";
import type { CreateCommentFormState } from "@/types/comment";
import type { CreatePostFormState } from "@/types/post";

const EMPTY_CONTENT_MESSAGE = "Write something before sending.";
const INVALID_POST_MESSAGE = "Post not found.";
const INVALID_PARENT_MESSAGE = "Reply target is invalid.";
const EMPTY_POST_CONTENT_MESSAGE = "Write something before posting.";
const INVALID_IMAGE_MESSAGE = "Choose a valid image file.";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_SIZE_MESSAGE = "Photo must be 5MB or smaller.";
const INVALID_VISIBILITY_MESSAGE = "Choose who can see this post.";

export async function createPostAction(
  _prevState: CreatePostFormState,
  formData: FormData,
): Promise<CreatePostFormState> {
  const content = String(formData.get("content") ?? "").trim();
  const visibility = String(formData.get("visibility") ?? "public").trim();
  const imageValue = formData.get("image");
  const image =
    imageValue instanceof File && imageValue.size > 0 ? imageValue : null;

  if (!content) {
    return {
      errors: {
        content: EMPTY_POST_CONTENT_MESSAGE,
      },
    };
  }

  if (image && !image.type.startsWith("image/")) {
    return {
      errors: {
        image: INVALID_IMAGE_MESSAGE,
      },
    };
  }

  if (image && image.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      errors: {
        image: MAX_IMAGE_SIZE_MESSAGE,
      },
    };
  }

  if (visibility !== "public" && visibility !== "private") {
    return {
      errors: {
        visibility: INVALID_VISIBILITY_MESSAGE,
      },
    };
  }

  try {
    await createPostFromApi({
      content,
      image,
      visibility,
    });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return {
        errors: {
          content: getApiFieldError(error.payload, "content"),
          image: getApiFieldError(error.payload, "image"),
          visibility: getApiFieldError(error.payload, "visibility"),
          form: error.message,
        },
      };
    }

    return {
      errors: {
        form: error instanceof Error ? error.message : "Unable to create post right now.",
      },
    };
  }

  revalidatePath("/feeds");

  return {
    success: true,
  };
}

export async function createCommentAction(
  _prevState: CreateCommentFormState,
  formData: FormData,
): Promise<CreateCommentFormState> {
  const content = String(formData.get("content") ?? "").trim();
  const postId = Number(formData.get("postId"));
  const parentIdValue = formData.get("parentId");
  const parentId = parentIdValue ? Number(parentIdValue) : null;

  if (!content) {
    return {
      errors: {
        content: EMPTY_CONTENT_MESSAGE,
      },
    };
  }

  if (!Number.isInteger(postId) || postId <= 0) {
    return {
      errors: {
        form: INVALID_POST_MESSAGE,
      },
    };
  }

  if (
    parentIdValue !== null &&
    (parentId === null || !Number.isInteger(parentId) || parentId <= 0)
  ) {
    return {
      errors: {
        parent_id: INVALID_PARENT_MESSAGE,
      },
    };
  }

  try {
    await createCommentFromApi({
      postId,
      content,
      parentId,
    });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return {
        errors: {
          content: getApiFieldError(error.payload, "content"),
          parent_id: getApiFieldError(error.payload, "parent_id"),
          form: error.message,
        },
      };
    }

    return {
      errors: {
        form: error instanceof Error ? error.message : "Unable to send comment right now.",
      },
    };
  }

  revalidatePath("/feeds");

  return {
    success: true,
  };
}
