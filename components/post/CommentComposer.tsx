"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { createCommentAction } from "@/app/posts/actions";
import { SendCommentIcon } from "@/components/icons";
import type { CreateCommentFormState } from "@/types/comment";

const initialState: CreateCommentFormState = {};

type CommentComposerProps = {
  postId: number;
  parentId?: number;
  placeholder: string;
  onSuccess?: () => void;
  className?: string;
};

export default function CommentComposer({
  postId,
  parentId,
  placeholder,
  onSuccess,
  className,
}: CommentComposerProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [state, formAction, pending] = useActionState(createCommentAction, initialState);

  useEffect(() => {
    if (!state.success) {
      return;
    }

    formRef.current?.reset();
    onSuccess?.();
    router.refresh();
  }, [onSuccess, router, state.success]);

  return (
    <div className={`_feed_inner_comment_box${className ? ` ${className}` : ""}`}>
      <form ref={formRef} action={formAction} className="_feed_inner_comment_box_form">
        <input type="hidden" name="postId" value={postId} />
        {parentId ? <input type="hidden" name="parentId" value={parentId} /> : null}
        <div className="_feed_inner_comment_box_content">
          <div className="_feed_inner_comment_box_content_image">
            <img src="/assets/images/comment_img.png" alt="" className="_comment_img" />
          </div>
          <div className="_feed_inner_comment_box_content_txt">
            <textarea
              name="content"
              className="form-control _comment_textarea"
              placeholder={placeholder}
              rows={2}
              aria-invalid={Boolean(state.errors?.content)}
            />
            {state.errors?.content ? (
              <p className="text-danger mt-2 mb-0" role="alert">
                {state.errors.content}
              </p>
            ) : null}
            {state.errors?.parent_id ? (
              <p className="text-danger mt-2 mb-0" role="alert">
                {state.errors.parent_id}
              </p>
            ) : null}
            {state.errors?.form ? (
              <p className="text-danger mt-2 mb-0" role="alert">
                {state.errors.form}
              </p>
            ) : null}
          </div>
        </div>
        <div className="_feed_inner_comment_box_icon">
          <button
            type="submit"
            className="_feed_inner_comment_box_icon_btn"
            disabled={pending}
            aria-disabled={pending}
          >
            <SendCommentIcon />
          </button>
        </div>
      </form>
    </div>
  );
}
