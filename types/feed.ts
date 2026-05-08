import type { ApiResponse, AuthUser } from "@/types/auth";
import type { CommentItem } from "@/types/comment";

export type FeedPost = {
  id: number;
  content: string;
  image_url: string | null;
  visibility: "public" | "private";
  comments_count: number;
  created_at: string;
  updated_at: string;
  user: AuthUser;
  comments: CommentItem[];
};

export type FeedResponse = ApiResponse<FeedPost[]>;
