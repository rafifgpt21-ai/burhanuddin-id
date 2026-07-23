"use client";

import { useActionState } from "react";

import { loginAction, type LoginState } from "@/app/[locale]/admin/login/actions";
import { ArrowRightIcon } from "@/components/icons";
import { getAdminCopy } from "@/data/admin";
import type { Locale } from "@/lib/i18n";

const initialState: LoginState = {};

export function LoginForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(loginAction, initialState);
  const copy = getAdminCopy(locale).login;

  return (
    <form action={action} className="admin-login-form" noValidate>
      <input name="locale" type="hidden" value={locale} />

      {state.message ? (
        <div className="form-alert" role="alert">
          {state.message}
        </div>
      ) : null}

      <div className="admin-field">
        <label htmlFor="admin-username">{copy.username}</label>
        <input
          aria-describedby={state.errors?.username ? "admin-username-error" : undefined}
          aria-invalid={Boolean(state.errors?.username)}
          autoComplete="username"
          id="admin-username"
          name="username"
          placeholder="nama.pengguna"
          required
          type="text"
        />
        {state.errors?.username ? (
          <p className="field-error" id="admin-username-error">
            {state.errors.username[0]}
          </p>
        ) : null}
      </div>

      <div className="admin-field">
        <label htmlFor="admin-password">{copy.password}</label>
        <input
          aria-describedby={state.errors?.password ? "admin-password-error" : undefined}
          aria-invalid={Boolean(state.errors?.password)}
          autoComplete="current-password"
          id="admin-password"
          name="password"
          required
          type="password"
        />
        {state.errors?.password ? (
          <p className="field-error" id="admin-password-error">
            {state.errors.password[0]}
          </p>
        ) : null}
      </div>

      <button className="button button-primary admin-submit" disabled={pending} type="submit">
        {pending ? copy.pending : copy.submit}
        {!pending ? <ArrowRightIcon /> : null}
      </button>
    </form>
  );
}
