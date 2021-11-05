import { App } from './app';
import Providers from '@/providers/providers';
import React from 'react';
import { RecoilRoot } from 'recoil';

function Entry () {
    return (
        <RecoilRoot>
            <Providers>
                <App />
            </Providers>
        </RecoilRoot>
    );
}

export default Entry;
