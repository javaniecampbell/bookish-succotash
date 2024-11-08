// page.tsx

'use client';
import React, {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useIndexedDb} from '@/app/providers/IndexDbProvider';
import {KioskBranchDataType, useBranchInfoContext} from "@/hooks/BranchInfoHook";

const SGJ_BRANCH_DATA_KEY = 'kiosk-branch-data';
type ResultType = { successful: boolean; data: KioskBranchDataType | undefined };
const Loader = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 150'>
    <path fill='none' stroke='#28403E' strokeWidth='15' strokeLinecap='round' strokeDasharray='300 385'
          strokeDashoffset='0'
          d='M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z'>
        <animate attributeName='stroke-dashoffset' calcMode='spline' dur='2' values='685;-685' keySplines='0 0 1 1'
                 repeatCount='indefinite'></animate>
    </path>
</svg>

const branchDataStringToObject = (encodedString: string): ResultType => {
    if (!encodedString) {
        return {successful: false, data: undefined};
    }
    try {
        const decodedStr = atob(encodedString);
        const data = JSON.parse(decodedStr) as KioskBranchDataType;
        return {successful: true, data: data};
    } catch (error) {
        console.error('Error decoding or parsing the string:', error);
        return {successful: false, data: undefined};
    }
};

const encodeObject = () => {
    const kioskBranchData = JSON.stringify({
        kiosk: 'SGKIOSK-001',
        branch: 'UPK',
    });

    return Buffer.from(kioskBranchData).toString('base64');
};

const Register = () => {
    const {addData, db} = useIndexedDb();
    const params = useSearchParams();
    const {setBranchData, branch} = useBranchInfoContext()
    const [isInitializing, setIsInitializing] = useState(true);
    const [isError, setIsError] = useState(false);
    const {push} = useRouter();


    const addBranchDataToStorage = async () => {

        if (branch) return push('/')

        const base64String = params.get(SGJ_BRANCH_DATA_KEY);
        if (base64String) {
            const branchData = branchDataStringToObject(base64String);
            if (branchData.successful) {
                await addData(SGJ_BRANCH_DATA_KEY, branchData.data as KioskBranchDataType);
                setIsInitializing(false);
                setBranchData(branchData.data as KioskBranchDataType);

                setTimeout(() => {
                    push('/');
                }, 500)

            } else {
                setIsInitializing(false);
                setIsError(true);
            }
        }
    };

    useEffect(() => {
        addBranchDataToStorage().catch();
    }, [params, db, branch]);


    return (
        <div style={{zIndex: '999'}} className="text-center h-screen w-full grid  place-items-center">


            {isError && (
                <div className="text-center">
                    <div>Kiosk failed to initialize.</div>
                    <span>Please try again!</span>
                </div>
            )}

            {!isError && isInitializing && (
                <div className="branch-info__loading">
                    <div>Loading indicator</div>
                    {Loader}
                    <span>Initializing Kiosk...</span>
                </div>
            )}

            {!isError && !isInitializing && (
                <div>
                    <span>Kiosk Initialized Successfully!</span>
                </div>
            )}
        </div>
    );
};

export default Register;
