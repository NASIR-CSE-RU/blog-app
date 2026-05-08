import type { ApiResponse, AuthUser } from "@/types/auth";

export type CommentItem = {
  id: number;
  post_id: number;
  parent_id: number | null;
  content: string;
  replies_count: number;
  created_at: string;
  updated_at: string;
  user: AuthUser;
  replies: CommentItem[];
};

export type CommentResponse = ApiResponse<CommentItem[]>;

export type CreateCommentFormState = {
  errors?: {
    content?: string;
    parent_id?: string;
    form?: string;
  };
  success?: boolean;
};
