import Providers from '../newuiupdate/providers/providers';
import Layout from './layout';
import React from 'react';
import { RecoilRoot } from 'recoil';
// import RecoilizeDebugger from 'recoilize';

function Entry () {
    return (
        <RecoilRoot>
            {/* <RecoilizeDebugger root={app} /> */}
            <Providers>
                <Layout />
            </Providers>
        </RecoilRoot>
    );
}

export default Entry;
