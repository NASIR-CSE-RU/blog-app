"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { LikeReactionIcon } from "@/components/icons";
import { useReactionToggle } from "@/components/post/hooks/useReactionToggle";
import type { ReactionUserSummary } from "@/types/feed";

type PostLikeButtonProps = {
  postId: number;
  initialReactionsCount: number;
  initialViewerHasLiked: boolean;
  reactionUsers: ReactionUserSummary[];
  commentsCount: number;
  children?: ReactNode;
};

export default function PostLikeButton({
  postId,
  initialReactionsCount,
  initialViewerHasLiked,
  reactionUsers,
  commentsCount,
  children,
}: PostLikeButtonProps) {
  const { errorMessage, hasLiked, isPending, reactionsCount, toggleReaction } = useReactionToggle({
    reactableType: "post",
    reactableId: postId,
    initialReactionsCount,
    initialViewerHasLiked,
  });
  const [reactionUserList, setReactionUserList] = useState(reactionUsers);
  const [isHoveringReactionUsers, setIsHoveringReactionUsers] = useState(false);
  const visibleReactionCircles = Math.min(reactionsCount, 3);
  const remainingReactionCount = Math.max(reactionsCount - 3, 0);
  const reactionUserNames = reactionUserList.map((user) =>
    `${user.first_name} ${user.last_name}`.trim(),
  );

  useEffect(() => {
    setReactionUserList(reactionUsers);
  }, [reactionUsers]);

  return (
    <>
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div
          className="_feed_inner_timeline_total_reacts_image"
          style={{ position: "relative" }}
          onMouseEnter={() => setIsHoveringReactionUsers(true)}
          onMouseLeave={() => setIsHoveringReactionUsers(false)}
        >
          {Array.from({ length: visibleReactionCircles }).map((_, index) => (
            <img
              key={index}
              src={`/assets/images/react_img${Math.min(index + 1, 3)}.png`}
              alt=""
              className={index === 0 ? "_react_img1" : "_react_img"}
            />
          ))}
          {remainingReactionCount > 0 ? (
            <span
              className="_feed_inner_timeline_total_reacts_para"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                borderRadius: "999px",
                backgroundColor: "#eef3ff",
                color: "#1877F2",
                fontWeight: 600,
                marginLeft: visibleReactionCircles > 0 ? "-8px" : "0",
                border: "2px solid #fff",
              }}
            >
              +{remainingReactionCount}
            </span>
          ) : null}
          {reactionsCount > 0 && reactionUserNames.length > 0 && isHoveringReactionUsers ? (
            <div
              role="tooltip"
              style={{
                position: "absolute",
                left: 0,
                top: "calc(100% + 12px)",
                minWidth: "220px",
                maxWidth: "280px",
                padding: "12px 14px",
                borderRadius: "14px",
                background: "#1c1e21",
                color: "#fff",
                boxShadow: "0 14px 34px rgba(35, 40, 48, 0.18)",
                zIndex: 20,
              }}
            >
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 700 }}>
                Reactions
              </p>
              <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none" }}>
                {reactionUserNames.map((name) => (
                  <li key={name} style={{ fontSize: "13px", lineHeight: 1.6 }}>
                    {name}
                  </li>
                ))}
              </ul>
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "18px",
                  bottom: "100%",
                  width: "12px",
                  height: "12px",
                  background: "#5f6672",
                  transform: "rotate(45deg) translateY(6px)",
                }}
              />
            </div>
          ) : null}
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <a href="#0"><span>{commentsCount}</span> Comment</a>
          </p>
          <p className="_feed_inner_timeline_total_reacts_para2"><span>122</span> Share</p>
        </div>
      </div>
      <div className="_feed_inner_timeline_reaction">
        <button
          type="button"
          className={`_feed_inner_timeline_reaction_emoji _feed_reaction${hasLiked ? " _feed_reaction_active" : ""}`}
          onClick={toggleReaction}
          disabled={isPending}
          aria-pressed={hasLiked}
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <LikeReactionIcon active={hasLiked} />
              {isPending ? "Working..." : "Like"}
            </span>
          </span>
        </button>
        {children}
      </div>
      {errorMessage ? (
        <p className="text-danger px-4 pb-3 mb-0" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </>
  );
}
