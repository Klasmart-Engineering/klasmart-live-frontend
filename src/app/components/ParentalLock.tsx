import { ParentalGate } from "@/app/dialogs/parentalGate";
import { dialogsState } from "@/app/model/appModel";
import { Dialog } from "@material-ui/core";
import React from "react";
import { useRecoilState } from "recoil";

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

    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);

    const setParentalLock = (open: boolean) => {
        setDialogs({
            ...dialogs,
            isParentalLockOpen: open,
        });
    };

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
