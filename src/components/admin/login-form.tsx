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
        <label htmlFor="admin-email">{copy.email}</label>
        <input
          aria-describedby={state.errors?.email ? "admin-email-error" : undefined}
          aria-invalid={Boolean(state.errors?.email)}
          autoComplete="username"
          id="admin-email"
          name="email"
          placeholder="admin@domain.id"
          required
          type="email"
        />
        {state.errors?.email ? (
          <p className="field-error" id="admin-email-error">
            {state.errors.email[0]}
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
