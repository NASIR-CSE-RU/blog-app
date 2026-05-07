export type CreatePostFormState = {
  errors?: {
    content?: string;
    image?: string;
    form?: string;
  };
  success?: boolean;
};
