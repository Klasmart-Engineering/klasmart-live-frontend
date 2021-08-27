import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
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
