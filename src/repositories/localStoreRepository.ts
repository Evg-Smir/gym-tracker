const DB_NAME = 'PWAStorage';
const DB_VERSION = 1;
const STORE_NAME = 'dataStore';

export type LocalStoreKey = 'exercises' | 'categories' | 'isStorageSupported' | 'isFirebaseSupported';

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

export const getStorage = async <T = unknown>(name: LocalStoreKey): Promise<T[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(name);

    request.onsuccess = () => resolve((request.result as T[]) || []);
    request.onerror = () => reject(request.error);
  });
};

export const setStorage = async <T = unknown>(name: LocalStoreKey, data: T[]) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data, name);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

export const getLegacyLocalStorage = (name: 'exercises' | 'categories') => {
  const localData = localStorage.getItem(name === 'exercises' ? 'listExercises' : 'listCategories');
  return JSON.parse(localData as string);
};
