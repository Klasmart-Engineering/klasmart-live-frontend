import { Trophy } from '../newuiupdate/components/others/trophies/trophy';
import Layout from './layout';
import Providers from './providers/providers';
import React from 'react';
import { RecoilRoot } from 'recoil';
// import RecoilizeDebugger from 'recoilize';

function Entry () {
    return (
        <RecoilRoot>
            {/* <RecoilizeDebugger root={app} /> */}
            <Providers>
                <>
                    <Layout />
                    <Trophy />
                </>
            </Providers>
        </RecoilRoot>
    );
}

export default Entry;
