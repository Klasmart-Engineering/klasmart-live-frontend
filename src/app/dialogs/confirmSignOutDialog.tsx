import {
    TEXT_COLOR_CONSTRAST_DEFAULT,
    THEME_COLOR_ORG_MENU_DRAWER,
} from "@/config";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";

interface Props {
    visible: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    title?: string;
    description?: string[];
    closeLabel?: string;
    confirmLabel?: string;
    showCloseIcon?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
    baseButton: {
        width: `100%`,
        borderRadius: theme.spacing(2),
        fontWeight: theme.typography.fontWeightBold as number,
        fontSize: `1rem`,
        [theme.breakpoints.up(`sm`)]: {
            padding: theme.spacing(1.5, 0),
            fontSize: `1.3rem`,
        },
    },
    cancelButton: {
        backgroundColor: TEXT_COLOR_CONSTRAST_DEFAULT,
        color: THEME_COLOR_ORG_MENU_DRAWER,
        border: `1px solid ${THEME_COLOR_ORG_MENU_DRAWER}`,
        marginBottom: theme.spacing(1),
    },
    confirmButton: {
        backgroundColor: THEME_COLOR_ORG_MENU_DRAWER,
        color: TEXT_COLOR_CONSTRAST_DEFAULT,
    },
    wrapperDialog: {
        margin: theme.spacing(8),
        borderRadius: theme.spacing(2),
        [theme.breakpoints.up(`sm`)]: {
            padding: theme.spacing(0, 3),
            borderRadius: theme.spacing(4),
        },
    },
    wrapperButtons: {
        padding: theme.spacing(2),
        display: `block`,
        [theme.breakpoints.up(`sm`)]: {
            paddingBottom: theme.spacing(4),
        },
    },
    title: {
        fontSize: `1.15rem`,
        fontWeight: theme.typography.fontWeightMedium as number,
        [theme.breakpoints.up(`sm`)]: {
            fontSize: `1.5rem`,
            padding: theme.spacing(6, 5, 8, 0),
        },
    },
}));

export const ConfirmSignOutDialog = (props: Props) => {
    const {
        visible,
        onClose,
        onConfirm,
        title,
        closeLabel,
        confirmLabel,
    } = props;
    const classes = useStyles();
    return (
        <Dialog
            open={visible}
            PaperProps={{
                className: classes.wrapperDialog,
            }}
        >
            <DialogTitle>
                <Typography className={classes.title}>
                    {title}
                </Typography>
            </DialogTitle>
            <DialogActions
                disableSpacing
                className={classes.wrapperButtons}
            >
                <Button
                    className={clsx(classes.cancelButton, classes.baseButton)}
                    onClick={onClose}
                >
                    {closeLabel}
                </Button>

                <Button
                    className={clsx(classes.confirmButton, classes.baseButton)}
                    onClick={onConfirm}
                >
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
