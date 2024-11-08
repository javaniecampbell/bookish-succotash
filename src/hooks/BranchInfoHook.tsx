'use client';
import React, {createContext, PropsWithChildren, useContext, useEffect, useMemo, useState} from 'react';
import {useIndexedDb} from "@/app/providers/IndexDbProvider";

export interface KioskBranchDataType {
    branch: string;
    kiosk: string;
}

interface BranchInfoHookTypes extends KioskBranchDataType {
    setBranchData: React.Dispatch<React.SetStateAction<KioskBranchDataType>>;
}

export const SGJ_BRANCH_DATA_KEY = 'kiosk-branch-data';

const BranchInfoHookProvider = createContext({} as BranchInfoHookTypes);
export const useBranchInfoContext = () => useContext(BranchInfoHookProvider);

const BranchInfoHook = ({children}: PropsWithChildren) => {
    const {getData, db} = useIndexedDb();
    const [branchData, setBranchData] = useState<KioskBranchDataType>({} as KioskBranchDataType);

    const getBranchData = async () => {
        if (!db) return;

        if (Object.values(branchData).length !== 0) return
        console.log(Object.values(branchData).length)
        const data = await getData(SGJ_BRANCH_DATA_KEY) as KioskBranchDataType

        if (Object.values(data).length !== 0) {
            setBranchData({kiosk: data.kiosk, branch: data.branch} satisfies KioskBranchDataType)
        }
    }
    useEffect(() => {
        getBranchData().catch((error) => console.log(error));
    }, [db]);

    const values = useMemo(
        (): BranchInfoHookTypes => ({
            branch: branchData.branch,
            kiosk: branchData.kiosk,
            setBranchData,
        }),
        [branchData.branch, branchData.kiosk],
    );
    return <BranchInfoHookProvider.Provider value={values}>{children}</BranchInfoHookProvider.Provider>;
};

export default BranchInfoHook;
