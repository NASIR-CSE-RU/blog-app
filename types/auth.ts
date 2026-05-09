export type AuthUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
};

export type LoginPayload = {
  user: AuthUser;
  access_token: string;
  token_type: "Bearer";
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  errors: unknown;
  meta: {
    timestamp: string;
    status_code: number;
  };
};

export type LoginFormState = {
  errors?: {
    email?: string;
    password?: string;
    form?: string;
  };
};

export type RegistrationFormState = {
  errors?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    form?: string;
  };
};
