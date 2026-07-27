"use client";

import { useCallback, useEffect, useState } from "react";

import { getAdminQolCopy } from "@/data/admin-qol";
import {
  deleteDraftRecovery,
  getDraftRecovery,
  putDraftRecovery,
  restoreRecoveryFields,
  serializeRecoveryFields,
  type DraftRecoveryEnvelope,
} from "@/lib/admin/draft-recovery";
import type { Locale } from "@/lib/i18n";

export function useEditorRecovery({
  baseDraftVersion,
  form,
  kind,
  locale,
  onRestore,
  recordId,
  serverUpdatedAt,
  userId,
}: {
  baseDraftVersion: number;
  form: HTMLFormElement | null;
  kind: string;
  locale: Locale;
  onRestore?: (recovery: DraftRecoveryEnvelope) => void;
  recordId: string;
  serverUpdatedAt: number;
  userId: string;
}) {
  const [recovery, setRecovery] = useState<DraftRecoveryEnvelope | null>(null);
  const copy = getAdminQolCopy(locale).editor;

  useEffect(() => {
    if (!form) return;
    let active = true;
    void getDraftRecovery(userId, kind, recordId).then((value) => {
      if (active && value && value.savedAt > serverUpdatedAt) setRecovery(value);
    });
    return () => {
      active = false;
    };
  }, [form, kind, recordId, serverUpdatedAt, userId]);

  useEffect(() => {
    if (!form) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const persist = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        void putDraftRecovery({
          userId,
          kind,
          recordId,
          baseDraftVersion,
          fields: serializeRecoveryFields(form),
        });
      }, 800);
    };
    form.addEventListener("input", persist);
    form.addEventListener("change", persist);
    return () => {
      clearTimeout(timer);
      form.removeEventListener("input", persist);
      form.removeEventListener("change", persist);
    };
  }, [baseDraftVersion, form, kind, recordId, userId]);

  const clear = useCallback(async () => {
    await deleteDraftRecovery(userId, kind, recordId);
    setRecovery(null);
  }, [kind, recordId, userId]);

  const restore = useCallback(() => {
    if (!form || !recovery) return;
    restoreRecoveryFields(form, recovery.fields);
    onRestore?.(recovery);
    setRecovery(null);
  }, [form, onRestore, recovery]);

  const notice = recovery ? (
    <div className="editor-recovery-notice" role="alert">
      <div>
        <strong>{copy.recoverTitle}</strong>
        <p>{copy.recoverBody}</p>
      </div>
      <div>
        <button className="button button-primary" onClick={restore} type="button">
          {copy.recover}
        </button>
        <button className="button button-secondary" onClick={() => void clear()} type="button">
          {copy.discard}
        </button>
      </div>
    </div>
  ) : null;

  return { clear, notice };
}
