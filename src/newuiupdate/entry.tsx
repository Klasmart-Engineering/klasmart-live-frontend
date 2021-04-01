import React from 'react'
import { RecoilRoot} from 'recoil';
import RecoilizeDebugger from 'recoilize';

import Layout from './layout';
import { ThemeProvider } from "@material-ui/core";
import { themeProvider } from "./themeProvider";

const app = document.getElementById('app');

function Entry() {
    return (
        <RecoilRoot>
            <ThemeProvider theme={themeProvider('en', 'light')}>
                {/* <RecoilizeDebugger root={app} /> */}
                <Layout />
            </ThemeProvider>
        </RecoilRoot>
    )
}

export default Entry
