import Button from "@mui/material/Button/Button";
import Dialog from "@mui/material/Dialog/Dialog";
import DialogActions from "@mui/material/DialogActions/DialogActions";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import DialogContentText from "@mui/material/DialogContentText/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import React from "react";

export type Props = {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export function ConfirmNavigationDialog ({
    visible, onCancel, onConfirm,
}: Props) {

    return (
        <Dialog
            open={visible}
            aria-labelledby="navigation-confirm-title"
            aria-describedby="navigation-confirm-description"
            onClose={onCancel}
        >
            <DialogTitle id="navigation-confirm-title">{`Visit external webpage?`}</DialogTitle>
            <DialogContent>
                <DialogContentText id="navigation-confirm-description">
                    Attempting to navigate to external page. Are you sure you want to continue?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    autoFocus
                    color="primary"
                    onClick={onConfirm}>
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
}
