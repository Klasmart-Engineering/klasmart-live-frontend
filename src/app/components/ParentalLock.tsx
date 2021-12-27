import { ParentalGate } from "@/app/dialogs/parentalGate";
import { openHyperLink } from "@/app/utils/link";
import { Dialog } from "@material-ui/core";
import React from "react";

interface Props {
    hyperlink: string;
    open: boolean;
    onClose: (isParentalGateSuccess: boolean) => void;
}

export default function DialogParentalLock (props: Props) {
    const {
        hyperlink,
        open,
        onClose,
    } = props;
    return (
        <Dialog
            fullScreen
            aria-labelledby="select-org-dialog"
            open={open}
            onClose={() => onClose(false)}
        >
            <ParentalGate
                setClosedDialog={() => onClose(false)}
                onCompleted={() => {
                    openHyperLink(hyperlink);
                    onClose(true);
                }}
            />
        </Dialog>
    );
}
