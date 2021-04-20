import Layout from './layout';
import { themeProvider } from "./themeProvider";
import { ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "kidsloop-px";
import React from 'react';
import { RecoilRoot } from 'recoil';
// import RecoilizeDebugger from 'recoilize';

function Entry () {
    return (
        <RecoilRoot>
            <ThemeProvider theme={themeProvider(`en`, `light`)}>
                <SnackbarProvider
                    anchorOrigin={{
                        vertical: `top`,
                        horizontal: `center`,
                    }}
                    closeButtonLabel="Dismiss">
                    {/* <RecoilizeDebugger root={app} /> */}
                    <Layout />
                </SnackbarProvider>
            </ThemeProvider>
        </RecoilRoot>
    );
}

export default Entry;
