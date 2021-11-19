import { ParentalGate } from "@/app/dialogs/parentalGate";
import { openHyperLink } from "@/app/utils/link";
import StyledIcon from "@/components/styled/icon";
import {
    createStyles,
    Dialog,
    DialogTitle,
    IconButton,
    makeStyles,
} from "@material-ui/core";
import { ArrowBack } from "@styled-icons/material";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    headerBackButton: {
        padding: 10,
    },
}));

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
    const classes = useStyles();
    return (
        <Dialog
            fullScreen
            aria-labelledby="select-org-dialog"
            open={open}
            onClose={() => onClose(false)}
        >
            <DialogTitle
                disableTypography
                id="select-org-dialog"
                className={classes.headerBackButton}
            >
                <IconButton
                    size="medium"
                    onClick={() => {
                        onClose(false);
                    }}
                >
                    <StyledIcon
                        icon={<ArrowBack/>}
                        size="medium"
                    />
                </IconButton>
            </DialogTitle>
            <ParentalGate onCompleted={() => {
                openHyperLink(hyperlink);
                onClose(true);
            }}/>
        </Dialog>
    );
}
