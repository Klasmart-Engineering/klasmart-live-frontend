import { ConfirmNavigationDialog } from "./confirmNavigationDialog";
import { ParentalGate } from "./parentalGate";
import {
    AppBar,
    Dialog,
    DialogContent,
    Grid,
    IconButton,
    makeStyles,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import React,
{
    useCallback,
    useEffect,
    useState,
} from "react";

declare let cordova: any;
declare let externalUrlIntercept: any;

const useStyles = makeStyles(() => ({
    appBar: {
        backgroundColor: `#cce8f9`,
        position: `relative`,
    },
    dialogTitleText: {
        color: `#193756`,
        textOverflow: `ellipsis`,
        overflow: `hidden`,
    },
}));

export function ExternalNavigationDialog (): JSX.Element {
    const { appBar, dialogTitleText } = useStyles();

    const [ awaitingNavigationConfirm, setAwaitingNavigationConfirm ] = useState(false);
    const [ awaitingParentalLock, setAwaitingParentalLock ] = useState(false);
    const [ destinationUrl, setDestinationUrl ] = useState<string>();

    useEffect(() => {
        externalUrlIntercept.initializeCallback((url: string) => {
            setAwaitingNavigationConfirm(true);

            console.log(`destinationUrl: ${url}`);
            setDestinationUrl(url);
        });
    }, []);

    const confirmExternalNavigation = useCallback(() => {
        setAwaitingNavigationConfirm(false);
        setAwaitingParentalLock(true);
    }, []);

    const completeExternalNavigation = useCallback(() => {
        setAwaitingParentalLock(false);

        console.log(`complete external navigation to: ${destinationUrl}`);

        try {
            cordova.InAppBrowser.open(destinationUrl, `_blank`);
        } catch(error) {
            console.error(error);
        }
    }, [ destinationUrl ]);

    return (<>
        <ConfirmNavigationDialog
            visible={awaitingNavigationConfirm}
            onCancel={() => setAwaitingNavigationConfirm(false)}
            onConfirm={confirmExternalNavigation} />
        { awaitingParentalLock ? <Dialog
            fullScreen
            scroll={`paper`}
            open={awaitingParentalLock}
            onClose={() => setAwaitingParentalLock(false)}>
            <AppBar className={appBar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        size={`medium`}
                        aria-label="close"
                        onClick={() => setAwaitingParentalLock(false)}>
                        <CloseIcon size={`42`} />
                    </IconButton>
                    <Grid
                        container
                        item
                        justify={`center`}
                        alignItems={`center`}>
                        <Typography
                            variant="h6"
                            className={dialogTitleText}>
                                Visit external page?
                        </Typography>
                    </Grid>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <ParentalGate
                    message={`Please ask your parent to confirm the navigation to external website.`}
                    onCompleted={completeExternalNavigation} />
            </DialogContent>
        </Dialog> : undefined }
    </>);
}
