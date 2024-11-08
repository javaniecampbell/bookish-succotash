'use client';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { initDatabase, KIOSK_STORE_NAME_KEY } from '@/app/providers/db';
import {KioskBranchDataType} from "@/hooks/BranchInfoHook";

type IndexedDbContextType = {
    addData(key: string, data: KioskBranchDataType): Promise<unknown>;
    getData(id: string): Promise<unknown>;
    db: IDBDatabase | null;
};


const IndexedDbContext = createContext<IndexedDbContextType>({} as IndexedDbContextType);

export function useIndexedDb() {
    return useContext(IndexedDbContext);
}

export function IndexDbProvider({ children }: PropsWithChildren) {
    const [db, setDb] = useState<IDBDatabase | null>(null);

    useEffect(() => {
        const initialize = async () => {
            // TODO: Check if window object is available
            if (typeof window !== 'undefined') {
                const indexedDatabase = await initDatabase();
                if (indexedDatabase) setDb(indexedDatabase);
            }
        };
        initialize().catch((error) => console.log(error));
    }, []);

    function addData(key: string, data: KioskBranchDataType) {
        return new Promise( (resolve, reject) => {
            if (!db) {
                reject('Database not initialized');
                return;
            }

            const transaction = db.transaction(KIOSK_STORE_NAME_KEY, 'readwrite');
            const objectStore = transaction.objectStore(KIOSK_STORE_NAME_KEY);
            const request = objectStore.add({ key, ...data });

            request.onsuccess = () => resolve('Data added successfully');
            request.onerror = (event: any) => reject(event.target.error);
        });
    }

    function getData(key: string) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject('Database not initialized');
                return;
            }

            const transaction = db.transaction(KIOSK_STORE_NAME_KEY, 'readonly');
            const objectStore = transaction.objectStore(KIOSK_STORE_NAME_KEY);
            const request = objectStore.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (event: any) => reject(event.target.error);
        });
    }

    const values = useMemo(
        () => ({
            addData,
            getData,
            db,
        }),
        [db]
    );

    return <IndexedDbContext.Provider value={values}>{children}</IndexedDbContext.Provider>;
}
