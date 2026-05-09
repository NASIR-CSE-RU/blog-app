"use client";

import { useState } from "react";

import { LikeReactionIcon } from "@/components/icons";
import { usePostComments } from "@/components/post/hooks/usePostComments";
import { useReactionToggle } from "@/components/post/hooks/useReactionToggle";
import CommentComposer from "@/components/post/CommentComposer";
import type { CommentItem } from "@/types/comment";

type PostCommentsSectionProps = {
  postId: number;
  comments: CommentItem[];
  commentsCount: number;
};

type CommentListProps = {
  comments: CommentItem[];
  onReply: (comment: CommentItem) => void;
  nested?: boolean;
};

function formatCommentDate(createdAt: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(createdAt));
}

function CommentList({
  comments,
  onReply,
  nested = false,
}: CommentListProps) {
  return (
    <div className={nested ? "mt-3 ms-4" : ""}>
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} onReply={onReply} />
      ))}
    </div>
  );
}

function CommentLikeButton({ commentId, initialReactionsCount, initialViewerHasLiked }: {
  commentId: number;
  initialReactionsCount: number;
  initialViewerHasLiked: boolean;
}) {
  const { errorMessage, hasLiked, isPending, label, reactionsCount, toggleReaction } = useReactionToggle({
    reactableType: "comment",
    reactableId: commentId,
    initialReactionsCount,
    initialViewerHasLiked,
  });

  return (
    <>
      <button
        type="button"
        className={`_previous_comment_txt p-0${hasLiked ? " text-primary" : ""}`}
        onClick={toggleReaction}
        disabled={isPending}
        aria-pressed={hasLiked}
      >
        <span className="d-inline-flex align-items-center gap-1">
          <LikeReactionIcon active={hasLiked} className="flex-shrink-0" />
          <span>{label}</span>
          {reactionsCount > 0 ? <span>({reactionsCount})</span> : null}
        </span>
      </button>
      {errorMessage ? (
        <p className="text-danger mb-0 mt-2" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </>
  );
}

function CommentCard({
  comment,
  onReply,
}: {
  comment: CommentItem;
  onReply: (comment: CommentItem) => void;
}) {
  const userName = `${comment.user.first_name} ${comment.user.last_name}`.trim();
  const replies = Array.isArray(comment.replies) ? comment.replies : [];

  return (
    <div className="_comment_main" id={`comment-${comment.id}`}>
      <div className="_comment_image">
        <span className="_comment_image_link">
          <img src="/assets/images/txt_img.png" alt={userName} className="_comment_img1" />
        </span>
      </div>
      <div className="_comment_area">
        <div className="_comment_details" style={{ maxWidth: "100%" }}>
          <div className="_comment_details_top">
            <div className="_comment_name">
              <h4 className="_comment_name_title">{userName}</h4>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{comment.content}</span>
            </p>
          </div>
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <li>
                  <CommentLikeButton
                    commentId={comment.id}
                    initialReactionsCount={comment.reactions_count}
                    initialViewerHasLiked={comment.viewer_has_liked}
                  />
                </li>
                <li>
                  <button
                    type="button"
                    className="_previous_comment_txt p-0"
                    onClick={() => onReply(comment)}
                  >
                    Reply.
                  </button>
                </li>
                <li><span>Share</span></li>
                <li><span className="_time_link">.{formatCommentDate(comment.created_at)}</span></li>
              </ul>
            </div>
          </div>
        </div>
        {replies.length > 0 ? (
          <CommentList comments={replies} onReply={onReply} nested />
        ) : null}
      </div>
    </div>
  );
}

function CommentThread({
  comment,
  postId,
  onLoadAll,
  hasLoadedAll,
}: {
  comment: CommentItem;
  postId: number;
  onLoadAll: () => void;
  hasLoadedAll: boolean;
}) {
  const [replyTarget, setReplyTarget] = useState<CommentItem | null>(null);
  const replies = Array.isArray(comment.replies) ? comment.replies : [];
  const repliesCount = typeof comment.replies_count === "number" ? comment.replies_count : replies.length;
  const hasMoreReplies = repliesCount > replies.length;

  return (
    <div>
      <CommentCard comment={comment} onReply={setReplyTarget} />
      {hasMoreReplies && !hasLoadedAll ? (
        <div className="_previous_comment mt-3">
          <button type="button" className="_previous_comment_txt" onClick={onLoadAll}>
            View all {repliesCount} replies
          </button>
        </div>
      ) : null}
      {replyTarget ? (
        <div className="_comment_main mt-3 mb-3 ms-4">
          <div className="_comment_image" style={{ visibility: "hidden" }} aria-hidden="true" />
          <div className="_comment_area">
            <CommentComposer
              postId={postId}
              parentId={replyTarget.id}
              placeholder={`Write a reply to ${replyTarget.user.first_name}`}
              onSuccess={() => setReplyTarget(null)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function PostCommentsSection({
  postId,
  comments,
  commentsCount,
}: PostCommentsSectionProps) {
  const { hasLoadedAll, isLoadingMore, loadAllComments, loadError, visibleComments } = usePostComments({
    postId,
    comments,
  });

  const hasMoreComments = commentsCount > visibleComments.length;

  return (
    <>
      <div className="_feed_inner_timeline_cooment_area">
        <CommentComposer postId={postId} placeholder="Write a comment" />
      </div>
      <div className="_timline_comment_main">
        {hasMoreComments && !hasLoadedAll ? (
          <div className="_previous_comment">
            <button type="button" className="_previous_comment_txt" onClick={loadAllComments} disabled={isLoadingMore}>
              {isLoadingMore ? "Loading comments..." : `View all ${commentsCount} comments`}
            </button>
          </div>
        ) : null}
        {loadError ? (
          <p className="text-danger mb-3" role="alert">
            {loadError}
          </p>
        ) : null}
        {visibleComments.length > 0 ? (
          visibleComments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              postId={postId}
              onLoadAll={loadAllComments}
              hasLoadedAll={hasLoadedAll}
            />
          ))
        ) : (
          <p className="_feed_inner_timeline_post_box_para">No comments yet.</p>
        )}
      </div>
    </>
  );
}
