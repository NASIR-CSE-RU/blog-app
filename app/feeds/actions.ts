"use server";

import { revalidatePath } from "next/cache";

import { ApiRequestError, getApiFieldError } from "@/lib/api/errors";
import { createPostFromApi } from "@/lib/post/api";
import type { CreatePostFormState } from "@/types/post";

const EMPTY_CONTENT_MESSAGE = "Write something before posting.";
const INVALID_IMAGE_MESSAGE = "Choose a valid image file.";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_SIZE_MESSAGE = "Photo must be 5MB or smaller.";

export async function createPostAction(
  _prevState: CreatePostFormState,
  formData: FormData,
): Promise<CreatePostFormState> {
  const content = String(formData.get("content") ?? "").trim();
  const imageValue = formData.get("image");
  const image =
    imageValue instanceof File && imageValue.size > 0 ? imageValue : null;

  if (!content) {
    return {
      errors: {
        content: EMPTY_CONTENT_MESSAGE,
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

  try {
    await createPostFromApi({
      content,
      image,
      visibility: "public",
    });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return {
        errors: {
          content: getApiFieldError(error.payload, "content"),
          image: getApiFieldError(error.payload, "image"),
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
