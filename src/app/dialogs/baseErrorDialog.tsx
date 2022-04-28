import {
    BACKGROUND_COLOR_CONFIRM_BUTTON,
    ERROR_TEXT_TITLE_COLOR,
} from "@/config";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Theme,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => createStyles({
    rounded_dialog: {
        borderRadius: theme.spacing(1.5),
    },
    dialogTitle: {
        paddingBottom: theme.spacing(1),
    },
    dialogTitleText: {
        color: ERROR_TEXT_TITLE_COLOR,
        fontWeight: theme.typography.fontWeightBold as number,
    },
    dialogActions: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(1),
    },
    buttonClose: {
        color: theme.palette.common.white,
        backgroundColor: BACKGROUND_COLOR_CONFIRM_BUTTON,
        "&:hover": {
            backgroundColor: BACKGROUND_COLOR_CONFIRM_BUTTON,
        },
    },
}));

interface Props {
    open: boolean;
    onClose: () => void;
    title: string;
    closeLabel: string;
    children: React.ReactNode;
}

export type ErrorDialogState = {
    open: boolean;
    title: string;
    description: string[];
}
export function BaseErrorDialog ({
    open, onClose, title,
    closeLabel, children,
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
                onClose={onClose}>
                <DialogTitle className={classes.dialogTitle}>
                    <Typography
                        variant="subtitle1"
                        className={classes.dialogTitleText}>{title}</Typography>
                </DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <Button
                        variant={`contained`}
                        className={classes.buttonClose}
                        onClick={onClose}>{closeLabel}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
