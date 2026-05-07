import type { ApiResponse, AuthUser } from "@/types/auth";

export type FeedPost = {
  id: number;
  content: string;
  image_url: string | null;
  visibility: "public" | "private";
  created_at: string;
  updated_at: string;
  user: AuthUser;
};

export type FeedResponse = ApiResponse<FeedPost[]>;
