"use client";

import { useActionState } from "react";

import { registrationAction } from "@/app/registration/actions";
import type { RegistrationFormState } from "@/types/auth";

const initialState: RegistrationFormState = {};

export default function RegistrationForm() {
  const [state, formAction, pending] = useActionState(registrationAction, initialState);

  return (
    <form className="_social_registration_form" action={formAction} noValidate>
      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="form-control _social_registration_input"
              autoComplete="given-name"
              aria-invalid={Boolean(state.errors?.firstName)}
            />
            {state.errors?.firstName ? (
              <p className="text-danger mt-2 mb-0" role="alert">
                {state.errors.firstName}
              </p>
            ) : null}
          </div>
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="form-control _social_registration_input"
              autoComplete="family-name"
              aria-invalid={Boolean(state.errors?.lastName)}
            />
            {state.errors?.lastName ? (
              <p className="text-danger mt-2 mb-0" role="alert">
                {state.errors.lastName}
              </p>
            ) : null}
          </div>
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control _social_registration_input"
              autoComplete="email"
              aria-invalid={Boolean(state.errors?.email)}
            />
            {state.errors?.email ? (
              <p className="text-danger mt-2 mb-0" role="alert">
                {state.errors.email}
              </p>
            ) : null}
          </div>
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control _social_registration_input"
              autoComplete="new-password"
              aria-invalid={Boolean(state.errors?.password)}
            />
            {state.errors?.password ? (
              <p className="text-danger mt-2 mb-0" role="alert">
                {state.errors.password}
              </p>
            ) : null}
          </div>
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8" htmlFor="confirmPassword">
              Repeat Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="form-control _social_registration_input"
              autoComplete="new-password"
              aria-invalid={Boolean(state.errors?.confirmPassword)}
            />
            {state.errors?.confirmPassword ? (
              <p className="text-danger mt-2 mb-0" role="alert">
                {state.errors.confirmPassword}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="form-check _social_registration_form_check">
            <input
              className="form-check-input _social_registration_form_check_input"
              type="checkbox"
              name="terms"
              id="agreeTerms"
              defaultChecked
            />
            <label
              className="form-check-label _social_registration_form_check_label"
              htmlFor="agreeTerms"
            >
              I agree to terms &amp; conditions
            </label>
          </div>
          {state.errors?.terms ? (
            <p className="text-danger mt-2 mb-0" role="alert">
              {state.errors.terms}
            </p>
          ) : null}
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
          <div className="_social_registration_form_btn _mar_t40 _mar_b60">
            <button
              type="submit"
              className="_social_registration_form_btn_link _btn1"
              disabled={pending}
              aria-disabled={pending}
            >
              {pending ? "Creating account..." : "Register"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
