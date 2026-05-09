import type { ApiResponse, AuthUser } from "@/types/auth";
import type { CommentItem } from "@/types/comment";

export type ReactionUserSummary = {
  id: number;
  first_name: string;
  last_name: string;
};

export type FeedPost = {
  id: number;
  content: string;
  image_url: string | null;
  visibility: "public" | "private";
  comments_count: number;
  reactions_count: number;
  viewer_has_liked: boolean;
  reaction_users: ReactionUserSummary[];
  created_at: string;
  updated_at: string;
  user: AuthUser;
  comments: CommentItem[];
};

export type FeedPagination = {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  has_more_pages: boolean;
};

export type FeedResponse = ApiResponse<FeedPost[]> & {
  meta: ApiResponse<FeedPost[]>["meta"] & {
    pagination: FeedPagination;
  };
};

export type FeedPage = {
  posts: FeedPost[];
  pagination: FeedPagination;
};
