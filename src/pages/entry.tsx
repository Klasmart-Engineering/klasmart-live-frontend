import { App } from './app';
import Providers from '@/providers/providers';
import React from 'react';
import { RecoilRoot } from 'recoil';
// import RecoilizeDebugger from 'recoilize';

function Entry () {
    return (
        <RecoilRoot>
            {/* <RecoilizeDebugger root={app} /> */}
            <Providers>
                <App />
            </Providers>
        </RecoilRoot>
    );
}

export default Entry;
