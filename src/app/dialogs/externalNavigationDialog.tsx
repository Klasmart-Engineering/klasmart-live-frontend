import { ConfirmNavigationDialog } from "./confirmNavigationDialog";
import { ParentalGate } from "./parentalGate";
import {
    Dialog,
    DialogContent,
} from "@material-ui/core";
import React,
{
    useCallback,
    useEffect,
    useState,
} from "react";

declare let cordova: any;
declare let externalUrlIntercept: any;

export function ExternalNavigationDialog (): JSX.Element {

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
            <DialogContent>
                <ParentalGate
                    setClosedDialog={() => setAwaitingParentalLock(false)}
                    onCompleted={completeExternalNavigation}
                />
            </DialogContent>
        </Dialog> : undefined }
    </>);
}
