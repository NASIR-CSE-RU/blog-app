export type ReactionItem = {
  id: number;
  user_id: number;
  reactable_type: "post" | "comment";
  reactable_id: number;
  type: number;
  created_at: string;
};

export type ToggleReactionResult = ReactionItem | null;
