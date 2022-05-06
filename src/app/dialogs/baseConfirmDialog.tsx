import {
    BACKGROUND_COLOR_CONFIRM_BUTTON,
    BG_COLOR_GO_LIVE_BUTTON,
    BG_COLOR_GRAY_BUTTON,
} from "@/config";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) =>
    createStyles({
        rounded_dialog: {
            borderRadius: `12px`,
        },
        dialogTitle: {
            paddingBottom: theme.spacing(1),
        },
        dialogText: {
            color: BG_COLOR_GO_LIVE_BUTTON,
            fontWeight: theme.typography.fontWeightBold as number,
        },
        dialogActions: {
            padding: theme.spacing(2),
            paddingTop: theme.spacing(1),
        },
        buttonClose: {
            color: BACKGROUND_COLOR_CONFIRM_BUTTON,
            backgroundColor: BG_COLOR_GRAY_BUTTON,
            "&:hover": {
                backgroundColor: BG_COLOR_GRAY_BUTTON,
            },
        },
        buttonConfirm: {
            color:  theme.palette.common.white,
            backgroundColor: BG_COLOR_GO_LIVE_BUTTON,
            "&:hover": {
                backgroundColor: BG_COLOR_GO_LIVE_BUTTON,
            },
        },
        actionButtons: {
            margin: theme.spacing(1.25, 0, 2.5),
            paddingRight: theme.spacing(2.5),
        },
    }));

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    closeLabel: string;
    confirmLabel: string;
    children: React.ReactNode;
}

export function BaseConfirmDialog ({
    open, onClose, onConfirm, title,
    closeLabel, confirmLabel, children,
}: Props): JSX.Element {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Dialog
                fullWidth
                maxWidth={`sm`}
                className={classes.rounded_dialog}
                classes={{
                    paper: classes.rounded_dialog,
                }}
                open={open}
                onClose={onClose}
            >
                <DialogTitle className={classes.dialogTitle}>
                    <Typography
                        variant="subtitle1"
                        className={classes.dialogText}
                    >{title}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <Button
                        className={classes.buttonClose}
                        onClick={onClose}
                    >{closeLabel}
                    </Button>
                    <Button
                        className={classes.buttonConfirm}
                        onClick={onConfirm}
                    >{confirmLabel}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
