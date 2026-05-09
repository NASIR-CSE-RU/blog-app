import {
  CommentReactionIcon,
  DropdownDotsIcon,
  ShareReactionIcon,
} from "@/components/icons";
import PostLikeButton from "@/components/post/PostLikeButton";
import PostCommentsSection from "@/components/post/PostCommentsSection";
import type { FeedPost } from "@/types/feed";

type PostProps = {
  post: FeedPost;
};

function formatPostDate(createdAt: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(createdAt));
}

function formatVisibility(visibility: FeedPost["visibility"]) {
  return visibility.charAt(0).toUpperCase() + visibility.slice(1);
}

export default function Post({ post }: PostProps) {
  const userName = `${post.user.first_name} ${post.user.last_name}`.trim();
  const timelineDropdownId = `timeline-drop-${post.id}`;

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img src="/assets/images/post_img.png" alt={userName} className="_post_img" />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">{userName}</h4>
              <p className="_feed_inner_timeline_post_box_para">
                {formatPostDate(post.created_at)} . <a href="#0">{formatVisibility(post.visibility)}</a>
              </p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown">
            <div className="_feed_timeline_post_dropdown">
              <button type="button" className="_feed_timeline_post_dropdown_link" aria-controls={timelineDropdownId}>
                <DropdownDotsIcon />
              </button>
            </div>
            <div id={timelineDropdownId} className="_feed_timeline_dropdown _timeline_dropdown">
              <ul className="_feed_timeline_dropdown_list">
                <li className="_feed_timeline_dropdown_item">
                  <a href="#0" className="_feed_timeline_dropdown_link">Save Post</a>
                </li>
                <li className="_feed_timeline_dropdown_item">
                  <a href="#0" className="_feed_timeline_dropdown_link">Turn On Notification</a>
                </li>
                <li className="_feed_timeline_dropdown_item">
                  <a href="#0" className="_feed_timeline_dropdown_link">Hide</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
        {post.image_url ? (
          <div className="_feed_inner_timeline_image">
            <img src={post.image_url} alt="" className="_time_img" />
          </div>
        ) : null}
      </div>
      <PostLikeButton
        postId={post.id}
        initialReactionsCount={post.reactions_count}
        initialViewerHasLiked={post.viewer_has_liked}
        reactionUsers={post.reaction_users}
        commentsCount={post.comments_count}
      >
        <button type="button" className="_feed_inner_timeline_reaction_comment _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <CommentReactionIcon className="_reaction_svg" />
              Comment
            </span>
          </span>
        </button>
        <button type="button" className="_feed_inner_timeline_reaction_share _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <ShareReactionIcon className="_reaction_svg" />
              Share
            </span>
          </span>
        </button>
      </PostLikeButton>
      <PostCommentsSection postId={post.id} comments={post.comments} commentsCount={post.comments_count} />
    </div>
  );
}
