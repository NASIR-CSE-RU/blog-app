"use server";

import { revalidatePath } from "next/cache";

import { createPostFromApi } from "@/lib/post/api";
import type { CreatePostFormState } from "@/types/post";

const EMPTY_CONTENT_MESSAGE = "Write something before posting.";

export async function createPostAction(
  _prevState: CreatePostFormState,
  formData: FormData,
): Promise<CreatePostFormState> {
  const content = String(formData.get("content") ?? "").trim();

  if (!content) {
    return {
      errors: {
        content: EMPTY_CONTENT_MESSAGE,
      },
    };
  }

  try {
    await createPostFromApi({
      content,
      visibility: "public",
      image_url: null,
    });
  } catch (error) {
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
