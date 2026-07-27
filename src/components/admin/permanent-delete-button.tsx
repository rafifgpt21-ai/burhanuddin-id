"use client";

import { deleteEditorialAction } from "@/app/[locale]/admin/(workspace)/editor-actions";

export function PermanentDeleteButton({
  id,
  title,
  disabled,
}: {
  id: string;
  title: string;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      formAction={deleteEditorialAction.bind(null, id)}
      type="submit"
      onClick={(event) => {
        const confirmation = window.prompt(
          `Ketik judul berikut untuk menghapus permanen:\n${title}`,
        );
        if (confirmation !== title) event.preventDefault();
      }}
    >
      Hapus permanen
    </button>
  );
}
