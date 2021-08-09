import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import React from "react";

export type Props = {
    visible: boolean
    onCancel: () => void
    onConfirm: () => void
}

export function ConfirmNavigationDialog({ visible, onCancel, onConfirm }: Props) {

    return (
        <Dialog
            open={visible}
            onClose={onCancel}
            aria-labelledby="navigation-confirm-title"
            aria-describedby="navigation-confirm-description"
        >
            <DialogTitle id="navigation-confirm-title">{"Visit external webpage?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="navigation-confirm-description">
                    Attempting to navigate to external page. Are you sure you want to continue?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="primary" autoFocus>
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
};