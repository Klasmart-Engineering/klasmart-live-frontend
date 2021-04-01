import React from 'react'
import { RecoilRoot} from 'recoil';
import RecoilizeDebugger from 'recoilize';

import Layout from './layout';

const app = document.getElementById('app');

function NewUIEntry() {
    return (
        <RecoilRoot>
            {/* <RecoilizeDebugger root={app} /> */}
            <Layout />
        </RecoilRoot>
    )
}

export default NewUIEntry
