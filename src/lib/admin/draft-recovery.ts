"use client";

export const DRAFT_RECOVERY_TTL = 24 * 60 * 60 * 1000;
export const DRAFT_RECOVERY_SCHEMA_VERSION = 1;

export type DraftRecoveryEnvelope = {
  key: string;
  userId: string;
  kind: string;
  recordId: string;
  baseDraftVersion: number;
  savedAt: number;
  schemaVersion: number;
  fields: Record<string, string | string[] | boolean>;
};

const databaseName = "bm-editorial-recovery";
const storeName = "drafts";

function openRecoveryDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(storeName)) {
        const store = database.createObjectStore(storeName, { keyPath: "key" });
        store.createIndex("userId", "userId");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
) {
  const database = await openRecoveryDatabase();
  return new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(storeName, mode);
    const request = operation(transaction.objectStore(storeName));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

export function recoveryKey(userId: string, kind: string, recordId: string) {
  return `${userId}:${kind}:${recordId}`;
}

export async function putDraftRecovery(
  value: Omit<DraftRecoveryEnvelope, "key" | "savedAt" | "schemaVersion">,
) {
  const envelope: DraftRecoveryEnvelope = {
    ...value,
    key: recoveryKey(value.userId, value.kind, value.recordId),
    savedAt: Date.now(),
    schemaVersion: DRAFT_RECOVERY_SCHEMA_VERSION,
  };
  await withStore("readwrite", (store) => store.put(envelope));
  return envelope;
}

export async function getDraftRecovery(
  userId: string,
  kind: string,
  recordId: string,
) {
  const value = await withStore<DraftRecoveryEnvelope | undefined>(
    "readonly",
    (store) => store.get(recoveryKey(userId, kind, recordId)),
  );
  if (!value) return null;
  if (
    value.schemaVersion !== DRAFT_RECOVERY_SCHEMA_VERSION ||
    Date.now() - value.savedAt > DRAFT_RECOVERY_TTL
  ) {
    await deleteDraftRecovery(userId, kind, recordId);
    return null;
  }
  return value;
}

export async function deleteDraftRecovery(
  userId: string,
  kind: string,
  recordId: string,
) {
  await withStore("readwrite", (store) =>
    store.delete(recoveryKey(userId, kind, recordId)),
  );
}

export async function clearDraftRecoveriesForUser(userId: string) {
  const database = await openRecoveryDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(storeName, "readwrite");
    const index = transaction.objectStore(storeName).index("userId");
    const request = index.openCursor(IDBKeyRange.only(userId));
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      cursor.delete();
      cursor.continue();
    };
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error);
  });
}

export function serializeRecoveryFields(form: HTMLFormElement) {
  const fields: DraftRecoveryEnvelope["fields"] = {};
  const data = new FormData(form);
  for (const [name, raw] of data.entries()) {
    if (raw instanceof File || name.startsWith("$ACTION_")) continue;
    if (name in fields) {
      const previous = fields[name];
      fields[name] = Array.isArray(previous)
        ? [...previous, raw]
        : [String(previous), raw];
    } else {
      fields[name] = raw;
    }
  }
  for (const element of Array.from(form.elements)) {
    if (
      element instanceof HTMLInputElement &&
      element.type === "checkbox" &&
      element.name
    ) {
      fields[element.name] = element.checked;
    }
  }
  return fields;
}

export function restoreRecoveryFields(
  form: HTMLFormElement,
  fields: DraftRecoveryEnvelope["fields"],
) {
  for (const [name, value] of Object.entries(fields)) {
    const controls = form.elements.namedItem(name);
    if (!controls) continue;
    const items =
      controls instanceof RadioNodeList ? Array.from(controls) : [controls];
    for (const control of items) {
      if (control instanceof HTMLInputElement) {
        if (control.type === "checkbox") control.checked = Boolean(value);
        else if (!Array.isArray(value)) control.value = String(value);
      } else if (
        control instanceof HTMLTextAreaElement ||
        control instanceof HTMLSelectElement
      ) {
        if (!Array.isArray(value)) control.value = String(value);
      }
      control.dispatchEvent(new Event("input", { bubbles: true }));
      control.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
}
