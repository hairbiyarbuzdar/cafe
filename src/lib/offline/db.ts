"use client";

/**
 * Tiny promise wrapper around a single-store IndexedDB.
 *
 * Avoids adding `idb` as a dependency — we only need four operations
 * (put/get-all/delete/clear) against one object store, and the raw API
 * surface for that is small.
 */

const DB_NAME = "brewline-offline";
const DB_VERSION = 1;
const STORE = "mutations";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB open failed"));
  });
  return dbPromise;
}

function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T> | T,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const store = tx.objectStore(STORE);
        const out = fn(store);
        tx.oncomplete = () => {
          if (out instanceof IDBRequest) resolve(out.result as T);
          else resolve(out);
        };
        tx.onerror = () =>
          reject(tx.error ?? new Error("IndexedDB transaction failed"));
        tx.onabort = () =>
          reject(tx.error ?? new Error("IndexedDB transaction aborted"));
      }),
  );
}

export function idbPut<T extends { id: string }>(value: T): Promise<void> {
  return withStore("readwrite", (store) => {
    store.put(value);
  });
}

export function idbGetAll<T>(): Promise<T[]> {
  return withStore("readonly", (store) => store.getAll() as IDBRequest<T[]>);
}

export function idbDelete(id: string): Promise<void> {
  return withStore("readwrite", (store) => {
    store.delete(id);
  });
}

export function idbClear(): Promise<void> {
  return withStore("readwrite", (store) => {
    store.clear();
  });
}
