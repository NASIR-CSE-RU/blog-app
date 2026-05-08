export type CreatePostFormState = {
  errors?: {
    content?: string;
    image?: string;
    visibility?: string;
    form?: string;
  };
  success?: boolean;
};
