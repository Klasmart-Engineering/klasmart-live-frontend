import React, { createContext, ReactChild, ReactChildren, useCallback, useState } from "react";
import { ExitDialog } from "../components/exitDialog";
import Loading from "../components/loading";
import useCordovaInitialize from "../cordova-initialize";
import { History } from "history";

type Props = {
    children: ReactChild | ReactChildren | null,
    history: History<unknown>
}

type CordovaSystemContext = {
    ready: boolean,
    devicePermissions: boolean,
    restart?: () => void,
    quit?: () => void,
}

const CordovaSystemContext = createContext<CordovaSystemContext>({ ready: false, devicePermissions: false });

export function CordovaSystemProvider({ children, history }: Props) {
    const [displayExitDialogue, setDisplayExitDialogue] = useState<boolean>(false);

    const restart = useCallback(() => {
        (navigator as any).app.loadUrl("file:///android_asset/www/index.html", { wait: 0, loadingDialog: "Wait,Loading App", loadUrlTimeoutValue: 60000 });
    }, []);

    const quit = useCallback(() => {
        (navigator as any).app.exitApp();
    }, []);

    const { cordovaReady, permissions } = useCordovaInitialize(false, () => {
        const isRootPage = window.location.hash.includes("/schedule") || window.location.hash === "#/";
        if (window.location.hash.includes("/room")) {
            restart();
        } else if (isRootPage) {
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

    const LoadingPermissions = () => {
        return <Loading messageId="Camera and Microphone premissions required. Please grant the permissions and restart application." />;
    }

    const Content = () => {
        return <>
            { children}
            <ExitDialog visible={displayExitDialogue} onCancel={() => setDisplayExitDialogue(false)} onConfirm={() => quit()} />
        </>
    }

    return (
        <CordovaSystemContext.Provider value={{ ready: cordovaReady, devicePermissions: permissions, restart, quit }}>
            { !cordovaReady ? <LoadingCordova /> : <Content /> }
        </CordovaSystemContext.Provider>
    )
}