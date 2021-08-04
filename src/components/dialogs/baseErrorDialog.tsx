import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@material-ui/core";

const useStyles = makeStyles(() =>
    createStyles({
        rounded_dialog: {
            borderRadius: "12px",
        },
        dialogTitle: {
            backgroundColor: "#FF5C5C",
        },
        dialogTitleText: {
            color: "white"
        },
        buttonClose: {
            color: "white",
            backgroundColor: "#193756",
            borderRadius: 15,
        }
    })
)

interface Props {
    open: boolean,
    onClose: () => void,
    title: string,
    closeLabel: string,
    children: React.ReactNode
}

export type ErrorDialogState = {
    open: boolean,
    title: string,
    description: string[]
}
export function BaseErrorDialog({
                                open, onClose, title,
                                closeLabel, children
                            }: Props): JSX.Element {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Dialog fullWidth maxWidth={'sm'} className={classes.rounded_dialog}
                    classes={{paper: classes.rounded_dialog}} open={open} onClose={onClose}>
                <DialogTitle className={classes.dialogTitle}>
                    <Typography className={classes.dialogTitleText}>{title}</Typography>
                </DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} className={classes.buttonClose}>{closeLabel}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
