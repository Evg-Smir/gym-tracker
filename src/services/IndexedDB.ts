import { CategoryType } from '@/@types/categoryTypes';
import { DayOfExercisesType } from '@/@types/exerciseTypes';

const DB_NAME = 'PWAStorage';
const DB_VERSION = 1;
const STORE_NAME = 'dataStore';

type StorageName = 'exercises' | 'categories';
type StorageValue = CategoryType[] | DayOfExercisesType[];

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const userKey = (uid: string, name: StorageName) => `${uid}:${name}`;

export const getStorage = async <T extends StorageValue>(
  uid: string,
  name: StorageName,
): Promise<T> => {
  if (!uid) return [] as unknown as T;

  const db = await openDB();

  try {
    const scoped = await new Promise<unknown>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const request = transaction.objectStore(STORE_NAME).get(userKey(uid, name));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (Array.isArray(scoped) && scoped.length > 0) {
      return scoped as T;
    }

    const legacy = await new Promise<unknown>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const request = transaction.objectStore(STORE_NAME).get(name);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return (Array.isArray(legacy) ? legacy : []) as T;
  } finally {
    db.close();
  }
};

export const setStorage = async (
  uid: string,
  name: StorageName,
  data: StorageValue,
): Promise<boolean> => {
  if (!uid) return false;

  const db = await openDB();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const request = transaction.objectStore(STORE_NAME).put(data, userKey(uid, name));
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    return true;
  } finally {
    db.close();
  }
};

export const clearUserStorage = async (uid: string): Promise<void> => {
  if (!uid) return;

  const db = await openDB();

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete(userKey(uid, 'exercises'));
      store.delete(userKey(uid, 'categories'));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
};
