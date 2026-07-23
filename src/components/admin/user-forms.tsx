"use client";

import { useActionState } from "react";

import {
  createUserAction,
  updateManagedUserAction,
  updateOwnAccountAction,
  type UserActionState,
} from "@/app/[locale]/admin/(workspace)/user-actions";
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
          Nama tampilan
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
          Username
          <input
            aria-describedby={state.errors?.username ? "create-username-error" : "create-username-help"}
            aria-invalid={Boolean(state.errors?.username)}
            autoCapitalize="none"
            autoComplete="off"
            name="username"
            required
          />
          <small id="create-username-help">3–32 karakter; huruf kecil, angka, titik, _ atau -.</small>
          <FieldError errors={state.errors} field="username" id="create-username-error" />
        </label>
        <label>
          Role
          <select name="role" defaultValue="ADMIN">
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
          </select>
        </label>
        <span aria-hidden="true" />
        <label>
          Password
          <input
            aria-describedby={state.errors?.password ? "create-password-error" : "create-password-help"}
            aria-invalid={Boolean(state.errors?.password)}
            autoComplete="new-password"
            name="password"
            required
            type="password"
          />
          <small id="create-password-help">Minimal 12 karakter.</small>
          <FieldError errors={state.errors} field="password" id="create-password-error" />
        </label>
        <label>
          Ulangi password
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
        {pending ? "Menambahkan…" : "Tambah pengguna"}
      </button>
    </form>
  );
}

export type ManagedUser = {
  id: string;
  name: string;
  username: string;
  role: "ADMIN" | "EDITOR";
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

  return (
    <form action={action} className="managed-user-form" noValidate>
      <input name="locale" type="hidden" value={locale} />
      <input name="userId" type="hidden" value={user.id} />
      <div className="managed-user-meta">
        <span className={`role-stamp role-${user.role.toLowerCase()}`}>{user.role}</span>
        <small>Terakhir diperbarui {user.updatedAt}</small>
      </div>
      <FormMessage state={state} />
      <div className="user-form-grid">
        <label>
          Nama tampilan
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
          Username
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
          Role
          <select defaultValue={user.role} name="role">
            <option value="ADMIN">Admin</option>
            <option value="EDITOR">Editor</option>
          </select>
        </label>
        <span aria-hidden="true" />
        <label>
          Password baru <small>Kosongkan jika tidak diubah.</small>
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
          Ulangi password baru
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
      <button className="button button-secondary" disabled={pending} type="submit">
        {pending ? "Menyimpan…" : "Simpan perubahan"}
      </button>
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
        Username
        <input
          aria-describedby={state.errors?.username ? "account-username-error" : "account-username-help"}
          aria-invalid={Boolean(state.errors?.username)}
          autoCapitalize="none"
          autoComplete="username"
          defaultValue={username}
          name="username"
          required
        />
        <small id="account-username-help">Username baru digunakan pada login berikutnya.</small>
        <FieldError errors={state.errors} field="username" id="account-username-error" />
      </label>
      <label>
        Password saat ini
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
          Password baru <small>Kosongkan jika hanya mengganti username.</small>
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
          Ulangi password baru
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
        {pending ? "Menyimpan…" : "Simpan akun saya"}
      </button>
    </form>
  );
}
