import Layout from './layout';
import { themeProvider } from "./themeProvider";
import { ThemeProvider } from "@material-ui/core";
import React from 'react';
import { RecoilRoot } from 'recoil';
import RecoilizeDebugger from 'recoilize';

import {
    AlertDialogProvider,
    ConfirmDialogProvider,
    PromptDialogProvider,
    SnackbarProvider,
} from "kidsloop-px";

const app = document.getElementById(`app`);

function Entry () {
    return (
        <RecoilRoot>
            <ThemeProvider theme={themeProvider(`en`, `light`)}>
                <ConfirmDialogProvider>
                    <PromptDialogProvider>
                        <AlertDialogProvider>
                            <SnackbarProvider anchorOrigin={{ vertical: 'top',  horizontal: 'center', }} closeButtonLabel="Dismiss">
                                {/* <RecoilizeDebugger root={app} /> */}
                                <Layout />
                            </SnackbarProvider>
                        </AlertDialogProvider>
                    </PromptDialogProvider>
                </ConfirmDialogProvider>
            </ThemeProvider>
        </RecoilRoot>
    );
}

export default Entry;