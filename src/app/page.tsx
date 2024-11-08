'use client'
import React from 'react';
import {useBranchInfoContext} from "@/hooks/BranchInfoHook";

const Home = () => {
    const {branch, kiosk} = useBranchInfoContext()
    return (
        <div className={'text-center h-screen w-full grid  place-items-center'}>
            <div>
                {branch ?
                    <>
                        <div>{branch}</div>
                        <div>{kiosk}</div>
                    </>
                    : <div>Data Is Not Present In DB</div>
                }
            </div>
        </div>
    );
};

export default Home;
