import { ConfirmNavigationDialog } from "./confirmNavigationDialog";
import DialogParentalLock from "@/app/components/ParentalLock";
import { dialogsState } from "@/app/model/appModel";
import React,
{
    useCallback,
    useEffect,
    useState,
} from "react";
import { useRecoilState } from "recoil";

declare let cordova: any;
declare let externalUrlIntercept: any;

export function ExternalNavigationDialog (): JSX.Element {
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const [ destinationUrl, setDestinationUrl ] = useState<string>();

    useEffect(() => {
        externalUrlIntercept.initializeCallback((url: string) => {
            setExternalNavigation(true);

            console.log(`destinationUrl: ${url}`);
            setDestinationUrl(url);
        });
    }, []);

    const setParentalLock = (open: boolean) => {
        setDialogs({
            ...dialogs,
            isParentalLockOpen: open,
        });
    };

    const setExternalNavigation = (open: boolean) => {
        setDialogs({
            ...dialogs,
            isExternalNavigationOpen: open,
        });
    };

    const confirmExternalNavigation = useCallback(() => {
        setExternalNavigation(false);
        setParentalLock(true);
    }, []);

    const completeExternalNavigation = useCallback(() => {
        setParentalLock(false);
        setExternalNavigation(false);

        console.log(`complete external navigation to: ${destinationUrl}`);

        try {
            cordova.InAppBrowser.open(destinationUrl, `_blank`);
        } catch(error) {
            console.error(error);
        }
    }, [ destinationUrl ]);

    return (<>
        <ConfirmNavigationDialog
            visible={dialogs.isExternalNavigationOpen}
            onCancel={() => setExternalNavigation(false)}
            onConfirm={confirmExternalNavigation} />
        { dialogs.isParentalLockOpen ?
            <DialogParentalLock
                onCompleted={completeExternalNavigation}
            /> : undefined }
    </>);
}
