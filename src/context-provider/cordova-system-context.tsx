import React, {createContext, ReactChild, ReactChildren, useCallback, useState} from "react";
import { ExitDialog } from "../components/exitDialog";
import Loading from "../components/loading";
import useCordovaInitialize from "../cordova-initialize";
import { History } from "history";

type Props = {
    children: ReactChild | ReactChildren | null,
    history: History<unknown>
}

export type OnBackItem = {
    id: string,
    onBack: () => void,
    isAutoRemove?: boolean
}

type CordovaSystemContext = {
    ready: boolean,
    isIOS: boolean,
    isAndroid: boolean,
    devicePermissions: boolean,
    restart?: () => void,
    quit?: () => void,
    addOnBack?: (onBackItem: OnBackItem) => void,
    removeOnBack?: (id: string) => void
}

export const CordovaSystemContext = createContext<CordovaSystemContext>({ ready: false, devicePermissions: false, isIOS: false, isAndroid: false });

export function CordovaSystemProvider({ children, history }: Props) {
    const [displayExitDialogue, setDisplayExitDialogue] = useState<boolean>(false);
    const [onBackQueue, setOnBackQueue] = useState<OnBackItem[]>([])

    const addOnBack = (onBackItem: OnBackItem) => {
        console.log(onBackItem.id);
        let newOnBackQueue = onBackQueue.slice();
        newOnBackQueue.push(onBackItem);
        setOnBackQueue(newOnBackQueue);
    }

    const removeOnBack = (id: string) => {
        console.log(id);
        let newOnBackQueue = onBackQueue.filter(item => item.id !== id);
        setOnBackQueue(newOnBackQueue);
    }

    const restart = useCallback(() => {
        (navigator as any).app.loadUrl("file:///android_asset/www/index.html", { wait: 0, loadingDialog: "Wait,Loading App", loadUrlTimeoutValue: 60000 });
    }, []);

    const quit = useCallback(() => {
        (navigator as any).app.exitApp();
    }, []);

    const { cordovaReady, permissions, isIOS, isAndroid } = useCordovaInitialize(false, () => {
        const isRootPage = window.location.hash.includes("/schedule") || window.location.hash === "#/";

        if (window.location.hash.includes("/room")) {
            restart();
        } else if (isRootPage) {
            if(onBackQueue.length > 0){
                const latestOnBackItem = onBackQueue[onBackQueue.length - 1];
                latestOnBackItem.onBack();
                if(latestOnBackItem.isAutoRemove === undefined || latestOnBackItem.isAutoRemove){
                    removeOnBack(latestOnBackItem.id)
                }
                return
            }
            if (displayExitDialogue) {
                quit();
            } else {
                setDisplayExitDialogue(true);
            }
        }
        else {
            history.goBack();
        }
    });

    const LoadingCordova = () => {
        return <Loading messageId="cordova_loading" />;
    }

    return (
        <CordovaSystemContext.Provider value={{ ready: cordovaReady, devicePermissions: permissions, restart, quit, isIOS, isAndroid, addOnBack: addOnBack, removeOnBack: removeOnBack }}>
            { !cordovaReady ? <LoadingCordova /> : '' }
            {cordovaReady ? children : ''}
            {cordovaReady ? <ExitDialog visible={displayExitDialogue} onCancel={() => setDisplayExitDialogue(false)} onConfirm={() => quit()} /> : ''}
        </CordovaSystemContext.Provider>
    )
}
