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

export function ExitDialog ({
    visible, onCancel, onConfirm,
}: Props) {

    return (
        <Dialog
            open={visible}
            aria-labelledby="quit-confirm-title"
            aria-describedby="quit-confirm-description"
            onClose={onCancel}
        >
            <DialogTitle id="quit-confirm-title">{`Quit KidsLoop?`}</DialogTitle>
            <DialogContent>
                <DialogContentText id="quit-confirm-description">
                    Are you sure you want to quit? Press back button again to quit KidsLoop.
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
                    Quit
                </Button>
            </DialogActions>
        </Dialog>
    );
}
