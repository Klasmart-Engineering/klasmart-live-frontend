import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React,
{ VoidFunctionComponent } from "react";
import { FormattedMessage } from "react-intl";

export const PermissionAlertDialog: VoidFunctionComponent<{
    open: boolean;
    onClickClose: () => void;
    error?: Error;
}> = ({
    open: dialogOpen,
    onClickClose: handleDialogClose,
    error,
}) =>{
    const { content, title } = getMicrophoneError(error);
    return (
        <Dialog
            open={dialogOpen}
            aria-labelledby="media-permission-alert-title"
            aria-describedby="media-permission-alert-description"
            onClose={handleDialogClose}
        >
            <DialogTitle id="media-permission-alert-title">
                <FormattedMessage id={title} />
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="media-permission-alert-description">
                    <FormattedMessage id={content} />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={handleDialogClose}>
                    <FormattedMessage id="join_permissionAlertDialog_action_close" />
                </Button>
            </DialogActions>
        </Dialog>
    );
};


export const getMicrophoneError = (error?: Error) => {
    switch(error?.name) {
    case `PermissionDeniedError`:
    case `NotAllowedError`:
        return {
            title: `join_permissionAlertDialog_mic_blocked_title`,
            content: `join_permissionAlertDialog_mic_blocked_contentText_live`,
        };
    case `NotFoundError`:
    case `DevicesNotFoundError`:
        return {
            title: `join_permissionAlertDialog_mic_not_exist_title`,
            content: `join_permissionAlertDialog_mic_not_exist_contentText_live`,
        };
    default:
        return {
            title: `join_permissionAlertDialog_title`,
            content: `join_permissionAlertDialog_contentText_live`,
        };
    }
};
