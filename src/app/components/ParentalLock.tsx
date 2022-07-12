import { ParentalGate } from "@/app/dialogs/parentalGate";
import {
    dialogsState,
    isAuthenticatedStorage,
} from "@/app/model/appModel";
import {
    THEME_COLOR_BACKGROUND_ON_BOARDING,
    THEME_COLOR_BACKGROUND_PAPER,
    THEME_COLOR_ORG_MENU_DRAWER,
} from "@/config";
import { Dialog } from "@material-ui/core";
import React,
{ useEffect } from "react";
import {
    useRecoilState,
    useRecoilValue,
} from "recoil";

interface Props {
    onCompleted: () => void;
    onClose?: () => void;
    isWelcomeScreen?: boolean;
}

export default function DialogParentalLock (props: Props) {
    const {
        onCompleted,
        isWelcomeScreen,
        onClose = () => setParentalLock(false),
    } = props;
    const statusBar = (window as any).StatusBar;
    const isAuthenticated = useRecoilValue(isAuthenticatedStorage);

    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);

    const setParentalLock = (open: boolean) => {
        setDialogs({
            ...dialogs,
            isParentalLockOpen: open,
        });
    };

    useEffect(() => {
        statusBar.backgroundColorByHexString(THEME_COLOR_BACKGROUND_PAPER);
        return () => {
            statusBar.backgroundColorByHexString(isAuthenticated ? THEME_COLOR_ORG_MENU_DRAWER : THEME_COLOR_BACKGROUND_ON_BOARDING);
        };
    }, []);

    return (
        <Dialog
            fullScreen
            aria-labelledby="select-org-dialog"
            open={dialogs.isParentalLockOpen}
            onClose={onClose}
        >
            <ParentalGate
                isWelcomeScreen={isWelcomeScreen}
                setClosedDialog={onClose}
                onCompleted={onCompleted}
            />
        </Dialog>
    );
}
