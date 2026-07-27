"use client";

import { useActionState } from "react";

import {
  createUserAction,
  revokeManagedUserSessionsAction,
  updateManagedUserAction,
  updateOwnAccountAction,
  type UserActionState,
} from "@/app/[locale]/admin/(workspace)/user-actions";
import { getAdminQolCopy, adminText } from "@/data/admin-qol";
import type { Locale } from "@/lib/i18n";

const initialState: UserActionState = {};

function FormMessage({ state }: { state: UserActionState }) {
  if (!state.message) return null;
  return (
    <p className={`user-form-message ${state.ok ? "is-success" : ""}`} role={state.ok ? "status" : "alert"}>
      {state.message}
    </p>
  );
}

function FieldError({
  errors,
  field,
  id,
}: {
  errors?: UserActionState["errors"];
  field: string;
  id: string;
}) {
  const message = errors?.[field]?.[0];
  return message ? <span className="field-error" id={id}>{message}</span> : null;
}

export function CreateUserForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(createUserAction, initialState);

  return (
    <form action={action} className="user-create-form" noValidate>
      <input name="locale" type="hidden" value={locale} />
      <FormMessage state={state} />
      <div className="user-form-grid">
        <label>
          {adminText(locale, "Nama tampilan", "Display name")}
          <input
            aria-describedby={state.errors?.name ? "create-name-error" : undefined}
            aria-invalid={Boolean(state.errors?.name)}
            autoComplete="off"
            name="name"
            required
          />
          <FieldError errors={state.errors} field="name" id="create-name-error" />
        </label>
        <label>
          {adminText(locale, "Username", "Username")}
          <input
            aria-describedby={state.errors?.username ? "create-username-error" : "create-username-help"}
            aria-invalid={Boolean(state.errors?.username)}
            autoCapitalize="none"
            autoComplete="off"
            name="username"
            required
          />
          <small id="create-username-help">{adminText(locale, "3–32 karakter; huruf kecil, angka, titik, _ atau -.", "3–32 characters; lowercase letters, numbers, periods, _ or -.")}</small>
          <FieldError errors={state.errors} field="username" id="create-username-error" />
        </label>
        <label>
          {adminText(locale, "Role", "Role")}
          <select name="role" defaultValue="ADMIN">
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
          </select>
        </label>
        <span aria-hidden="true" />
        <label>
          {adminText(locale, "Password", "Password")}
          <input
            aria-describedby={state.errors?.password ? "create-password-error" : "create-password-help"}
            aria-invalid={Boolean(state.errors?.password)}
            autoComplete="new-password"
            name="password"
            required
            type="password"
          />
          <small id="create-password-help">{adminText(locale, "Minimal 12 karakter.", "At least 12 characters.")}</small>
          <FieldError errors={state.errors} field="password" id="create-password-error" />
        </label>
        <label>
          {adminText(locale, "Ulangi password", "Confirm password")}
          <input
            aria-describedby={state.errors?.passwordConfirmation ? "create-confirm-error" : undefined}
            aria-invalid={Boolean(state.errors?.passwordConfirmation)}
            autoComplete="new-password"
            name="passwordConfirmation"
            required
            type="password"
          />
          <FieldError errors={state.errors} field="passwordConfirmation" id="create-confirm-error" />
        </label>
      </div>
      <button className="button button-primary" disabled={pending} type="submit">
        {pending ? adminText(locale, "Menambahkan…", "Adding…") : adminText(locale, "Tambah pengguna", "Add user")}
      </button>
    </form>
  );
}

export type ManagedUser = {
  id: string;
  name: string;
  username: string;
  role: "ADMIN" | "EDITOR";
  activeSessions: number;
  updatedAt: string;
};

export function ManagedUserForm({
  locale,
  user,
}: {
  locale: Locale;
  user: ManagedUser;
}) {
  const [state, action, pending] = useActionState(updateManagedUserAction, initialState);
  const prefix = `user-${user.id}`;
  const copy = getAdminQolCopy(locale);

  return (
    <form action={action} className="managed-user-form" noValidate>
      <input name="locale" type="hidden" value={locale} />
      <input name="userId" type="hidden" value={user.id} />
      <div className="managed-user-meta">
        <span className={`role-stamp role-${user.role.toLowerCase()}`}>{user.role}</span>
        <small>{user.activeSessions} {copy.users.activeSessions} · {user.updatedAt}</small>
        <p>{user.role === "ADMIN" ? copy.users.roleAdmin : copy.users.roleEditor}</p>
      </div>
      <FormMessage state={state} />
      <div className="user-form-grid">
        <label>
          {adminText(locale, "Nama tampilan", "Display name")}
          <input
            aria-describedby={state.errors?.name ? `${prefix}-name-error` : undefined}
            aria-invalid={Boolean(state.errors?.name)}
            defaultValue={user.name}
            name="name"
            required
          />
          <FieldError errors={state.errors} field="name" id={`${prefix}-name-error`} />
        </label>
        <label>
          {adminText(locale, "Username", "Username")}
          <input
            aria-describedby={state.errors?.username ? `${prefix}-username-error` : undefined}
            aria-invalid={Boolean(state.errors?.username)}
            autoCapitalize="none"
            defaultValue={user.username}
            name="username"
            required
          />
          <FieldError errors={state.errors} field="username" id={`${prefix}-username-error`} />
        </label>
        <label>
          {adminText(locale, "Role", "Role")}
          <select defaultValue={user.role} name="role">
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
          </select>
        </label>
        <span aria-hidden="true" />
        <label>
          {adminText(locale, "Password baru", "New password")} <small>{adminText(locale, "Kosongkan jika tidak diubah.", "Leave blank to keep it unchanged.")}</small>
          <input
            aria-describedby={state.errors?.newPassword ? `${prefix}-password-error` : undefined}
            aria-invalid={Boolean(state.errors?.newPassword)}
            autoComplete="new-password"
            name="newPassword"
            type="password"
          />
          <FieldError errors={state.errors} field="newPassword" id={`${prefix}-password-error`} />
        </label>
        <label>
          {adminText(locale, "Ulangi password baru", "Confirm new password")}
          <input
            aria-describedby={state.errors?.passwordConfirmation ? `${prefix}-confirm-error` : undefined}
            aria-invalid={Boolean(state.errors?.passwordConfirmation)}
            autoComplete="new-password"
            name="passwordConfirmation"
            type="password"
          />
          <FieldError errors={state.errors} field="passwordConfirmation" id={`${prefix}-confirm-error`} />
        </label>
      </div>
      <div className="managed-user-actions">
        <button className="button button-secondary" disabled={pending} type="submit">
          {pending ? adminText(locale, "Menyimpan…", "Saving…") : adminText(locale, "Simpan perubahan", "Save changes")}
        </button>
        <button
          className="button button-danger"
          disabled={!user.activeSessions || pending}
          formAction={revokeManagedUserSessionsAction}
          onClick={(event) => {
            if (!window.confirm(copy.users.revokeConfirm)) event.preventDefault();
          }}
          type="submit"
        >
          {copy.users.revoke}
        </button>
      </div>
    </form>
  );
}

export function AccountForm({
  locale,
  username,
}: {
  locale: Locale;
  username: string;
}) {
  const [state, action, pending] = useActionState(updateOwnAccountAction, initialState);

  return (
    <form action={action} className="account-security-form" noValidate>
      <input name="locale" type="hidden" value={locale} />
      <FormMessage state={state} />
      <label>
        {adminText(locale, "Username", "Username")}
        <input
          aria-describedby={state.errors?.username ? "account-username-error" : "account-username-help"}
          aria-invalid={Boolean(state.errors?.username)}
          autoCapitalize="none"
          autoComplete="username"
          defaultValue={username}
          name="username"
          required
        />
        <small id="account-username-help">{adminText(locale, "Username baru digunakan pada login berikutnya.", "The new username will be used at the next sign-in.")}</small>
        <FieldError errors={state.errors} field="username" id="account-username-error" />
      </label>
      <label>
        {adminText(locale, "Password saat ini", "Current password")}
        <input
          aria-describedby={state.errors?.currentPassword ? "account-current-error" : undefined}
          aria-invalid={Boolean(state.errors?.currentPassword)}
          autoComplete="current-password"
          name="currentPassword"
          required
          type="password"
        />
        <FieldError errors={state.errors} field="currentPassword" id="account-current-error" />
      </label>
      <div className="user-form-grid">
        <label>
          {adminText(locale, "Password baru", "New password")} <small>{adminText(locale, "Kosongkan jika hanya mengganti username.", "Leave blank when changing only the username.")}</small>
          <input
            aria-describedby={state.errors?.newPassword ? "account-password-error" : undefined}
            aria-invalid={Boolean(state.errors?.newPassword)}
            autoComplete="new-password"
            name="newPassword"
            type="password"
          />
          <FieldError errors={state.errors} field="newPassword" id="account-password-error" />
        </label>
        <label>
          {adminText(locale, "Ulangi password baru", "Confirm new password")}
          <input
            aria-describedby={state.errors?.passwordConfirmation ? "account-confirm-error" : undefined}
            aria-invalid={Boolean(state.errors?.passwordConfirmation)}
            autoComplete="new-password"
            name="passwordConfirmation"
            type="password"
          />
          <FieldError errors={state.errors} field="passwordConfirmation" id="account-confirm-error" />
        </label>
      </div>
      <button className="button button-primary" disabled={pending} type="submit">
        {pending ? adminText(locale, "Menyimpan…", "Saving…") : adminText(locale, "Simpan akun saya", "Save my account")}
      </button>
    </form>
  );
}
