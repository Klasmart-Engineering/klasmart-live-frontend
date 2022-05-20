import { CloseIconButton } from "../components/icons/closeIconButton";
import {
    BACKGROUND_COLOR_CONFIRM_BUTTON,
    BG_COLOR_GO_LIVE_BUTTON,
    BG_COLOR_GRAY_BUTTON,
    TEXT_COLOR_MENU_DRAWER,
} from "@/config";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
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
            padding: theme.spacing(1, 2),
            "&:hover": {
                backgroundColor: BG_COLOR_GRAY_BUTTON,
            },
        },
        buttonConfirm: {
            color:  theme.palette.common.white,
            backgroundColor: BG_COLOR_GO_LIVE_BUTTON,
            padding: theme.spacing(1, 2),
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
    closeLabel?: string;
    confirmLabel: string;
    showCloseIcon?: boolean;
    children: React.ReactNode;
}

export function BaseConfirmDialog ({
    open, onClose, onConfirm, title,
    closeLabel, confirmLabel, showCloseIcon, children,
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
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        wrap="nowrap"
                    >
                        <Grid item>
                            <Typography
                                variant="subtitle1"
                                className={classes.dialogText}
                            >{title}
                            </Typography>
                        </Grid>
                        {showCloseIcon &&
                            <Grid item>
                                <CloseIconButton
                                    buttonSize="small"
                                    color={TEXT_COLOR_MENU_DRAWER}
                                    onClick={onClose}
                                />
                            </Grid>}
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    {closeLabel &&
                        <Button
                            className={classes.buttonClose}
                            onClick={onClose}
                        >{closeLabel}
                        </Button>
                    }
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
