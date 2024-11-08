let db: IDBDatabase | null = null;

export const DB_VALUE_KEY = 'key';
export const KIOSK_DB_NAME_KEY = 'sgj-kiosk-db';
export const KIOSK_STORE_NAME_KEY = 'kiosk-db-store';

export async function initDatabase(): Promise<IDBDatabase | null> {
    return new Promise((resolve, reject) => {
        if (db) return resolve(db);

        const request = indexedDB.open(KIOSK_DB_NAME_KEY, 1);

        request.onupgradeneeded = () => {
            const db = request.result;
            db.createObjectStore(KIOSK_STORE_NAME_KEY, { keyPath: 'key' });
        };

        request.onerror = (e) => {
            console.error('IndexedDB error:', e);
            reject(e);
        };

        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
    });
}
