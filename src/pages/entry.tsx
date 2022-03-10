import { WebApp } from './webApp';
import Providers from '@/providers/providers';
import React from 'react';
import { RecoilRoot } from 'recoil';

function Entry () {
    return (
        <RecoilRoot>
            <Providers>
                <WebApp />
            </Providers>
        </RecoilRoot>
    );
}

export default Entry;
