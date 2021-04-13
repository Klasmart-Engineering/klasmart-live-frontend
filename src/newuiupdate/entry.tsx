import Layout from './layout';
import { themeProvider } from "./themeProvider";
import { ThemeProvider } from "@material-ui/core";
import React from 'react';
import { RecoilRoot } from 'recoil';
import RecoilizeDebugger from 'recoilize';

const app = document.getElementById(`app`);

function Entry () {
    return (
        <RecoilRoot>
            <ThemeProvider theme={themeProvider(`en`, `light`)}>
                {/* <RecoilizeDebugger root={app} /> */}
                <Layout />
            </ThemeProvider>
        </RecoilRoot>
    );
}

export default Entry;