"use client";

import { useActionState } from "react";

import { loginAction } from "@/app/login/actions";
import type { LoginFormState } from "@/types/auth";

const initialState: LoginFormState = {};

type LoginFormProps = {
  redirectTo: string;
};

export default function LoginForm({ redirectTo }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form className="_social_login_form" action={formAction} noValidate>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_login_form_input _mar_b14">
            <label className="_social_login_label _mar_b8" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control _social_login_input"
              autoComplete="email"
              aria-invalid={Boolean(state.errors?.email)}
              aria-describedby={state.errors?.email ? "email-error" : undefined}
            />
            {state.errors?.email ? (
              <p id="email-error" className="text-danger mt-2 mb-0" role="alert">
                {state.errors.email}
              </p>
            ) : null}
          </div>
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_login_form_input _mar_b14">
            <label className="_social_login_label _mar_b8" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control _social_login_input"
              autoComplete="current-password"
              aria-invalid={Boolean(state.errors?.password)}
              aria-describedby={state.errors?.password ? "password-error" : undefined}
            />
            {state.errors?.password ? (
              <p id="password-error" className="text-danger mt-2 mb-0" role="alert">
                {state.errors.password}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
          <div className="form-check _social_login_form_check">
            <input
              className="form-check-input _social_login_form_check_input"
              type="checkbox"
              name="remember"
              id="rememberMe"
              defaultChecked
            />
            <label
              className="form-check-label _social_login_form_check_label"
              htmlFor="rememberMe"
            >
              Remember me
            </label>
          </div>
        </div>
        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
          <div className="_social_login_form_left">
            <p className="_social_login_form_left_para">Forgot password?</p>
          </div>
        </div>
      </div>
      {state.errors?.form ? (
        <div className="row">
          <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
            <p className="text-danger mt-3 mb-0" role="alert">
              {state.errors.form}
            </p>
          </div>
        </div>
      ) : null}
      <div className="row">
        <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
          <div className="_social_login_form_btn _mar_t40 _mar_b60">
            <button
              type="submit"
              className="_social_login_form_btn_link _btn1"
              disabled={pending}
              aria-disabled={pending}
            >
              {pending ? "Logging in..." : "Login now"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
