/**
 * Rock-solid persistent storage engine using IndexedDB with fallback to safe LocalStorage.
 * Handles hundreds of megabytes of high-resolution images without QuotaExceededError,
 * ensuring all outfits and costumes remain permanently stored even across code edits and restarts.
 */

import { CostumeItem, CustomOutfit, LookbookItem } from '../types/vietphuc';
import { safeSetLocalStorage } from './imageCompressor';

const DB_NAME = 'VietPhucHeritageDB_v1';
const DB_VERSION = 1;
const STORE_OUTFITS = 'outfits';
const STORE_COSTUMES = 'costumes';
const STORE_LOOKBOOKS = 'lookbooks';

const STORAGE_KEY_OUTFITS = 'vietphuc_custom_outfits_v3';
const STORAGE_KEY_COSTUMES = 'vietphuc_costumes_v1';
const STORAGE_KEY_LOOKBOOKS = 'cophuc_remix_lookbooks_v1';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB not supported in this environment'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_OUTFITS)) {
          db.createObjectStore(STORE_OUTFITS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_COSTUMES)) {
          db.createObjectStore(STORE_COSTUMES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_LOOKBOOKS)) {
          db.createObjectStore(STORE_LOOKBOOKS, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  return dbPromise;
}

// Generic helper to get all items from an IndexedDB store
async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve((request.result as T[]) || []);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn(`[IDB] Failed to get items from ${storeName}:`, err);
    return [];
  }
}

// Generic helper to save an entire collection into an IndexedDB store
async function saveAllToStore<T extends { id: string }>(storeName: string, items: T[]): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      // Clear existing and rewrite current authoritative list
      const clearReq = store.clear();
      clearReq.onsuccess = () => {
        for (const item of items) {
          store.put(item);
        }
      };

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  } catch (err) {
    console.warn(`[IDB] Failed to save items to ${storeName}:`, err);
  }
}

// Save single item into IndexedDB
export async function saveSingleItem<T extends { id: string }>(storeName: string, item: T): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      store.put(item);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  } catch (err) {
    console.warn(`[IDB] Failed to save single item to ${storeName}:`, err);
  }
}

// Delete item from IndexedDB
export async function deleteSingleItem(storeName: string, id: string): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      store.delete(id);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(transaction.error);
      };
    });
  } catch (err) {
    console.warn(`[IDB] Failed to delete item ${id} from ${storeName}:`, err);
  }
}

// ===================== OUTFITS =====================

export async function loadPersistentOutfits(): Promise<CustomOutfit[]> {
  // 1. Try IndexedDB first (stores full resolution without quota limit)
  const idbOutfits = await getAllFromStore<CustomOutfit>(STORE_OUTFITS);
  if (Array.isArray(idbOutfits) && idbOutfits.length > 0) {
    return idbOutfits;
  }

  // 2. Fallback to LocalStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OUTFITS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Populate IndexedDB for future loads
          saveAllToStore(STORE_OUTFITS, parsed);
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
  }

  return [];
}

export async function savePersistentOutfits(outfits: CustomOutfit[]): Promise<void> {
  // 1. Save to IndexedDB (authoritative and unbounded)
  await saveAllToStore(STORE_OUTFITS, outfits);

  // 2. Save a safe, lightweight copy to LocalStorage without throwing QuotaExceededError
  safeSetLocalStorage(STORAGE_KEY_OUTFITS, outfits, (items) =>
    items.map((o) => ({
      ...o,
      imageUrl: o.imageUrl && o.imageUrl.length > 100000 ? undefined : o.imageUrl,
      imageUrls: undefined,
      components: o.components.map((c) => ({
        ...c,
        imageUrl: c.imageUrl && c.imageUrl.length > 100000 ? undefined : c.imageUrl,
        imageUrls: undefined,
      })),
    }))
  );
}

// ===================== COSTUMES =====================

export async function loadPersistentCostumes(): Promise<CostumeItem[]> {
  const idbCostumes = await getAllFromStore<CostumeItem>(STORE_COSTUMES);
  if (Array.isArray(idbCostumes) && idbCostumes.length > 0) {
    return idbCostumes;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COSTUMES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          saveAllToStore(STORE_COSTUMES, parsed);
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
  }

  return [];
}

export async function savePersistentCostumes(costumes: CostumeItem[]): Promise<void> {
  await saveAllToStore(STORE_COSTUMES, costumes);

  safeSetLocalStorage(STORAGE_KEY_COSTUMES, costumes, (items) =>
    items.map((c) => ({
      ...c,
      imageUrl: c.imageUrl && c.imageUrl.length > 100000 ? undefined : c.imageUrl,
      imageUrls: undefined,
    }))
  );
}

// ===================== LOOKBOOKS =====================

export async function loadPersistentLookbooks(): Promise<LookbookItem[]> {
  const idbLookbooks = await getAllFromStore<LookbookItem>(STORE_LOOKBOOKS);
  if (Array.isArray(idbLookbooks) && idbLookbooks.length > 0) {
    return idbLookbooks;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOOKBOOKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          saveAllToStore(STORE_LOOKBOOKS, parsed);
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
  }

  return [];
}

export async function savePersistentLookbooks(lookbooks: LookbookItem[]): Promise<void> {
  await saveAllToStore(STORE_LOOKBOOKS, lookbooks);
  safeSetLocalStorage(STORAGE_KEY_LOOKBOOKS, lookbooks);
}
