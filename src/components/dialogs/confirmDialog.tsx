import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) =>
    createStyles({
        rounded_dialog: {
            borderRadius: "12px",
        },
        dialogTitle: {
            backgroundColor: "#FFCC00",
        },
        dialogText: {
            color: "#142C45"
        },
        buttonClose: {
            color: "#193756",
            backgroundColor: "#D6D6D6",
            borderRadius: 15
        },
        buttonConfirm: {
            color: "white",
            backgroundColor: "#193756",
            borderRadius: 15,
            marginLeft: theme.spacing(1)
        }
    })
)

interface Props {
    open: boolean,
    onClose: () => void,
    onConfirm: () => void,
    title: string | Element,
    description: (string | Element)[],
    closeLabel: string,
    confirmLabel: string
}

export function ConfirmDialog({
                                  open, onClose, onConfirm,
                                  title, description,
                                  closeLabel, confirmLabel
                              }: Props): JSX.Element {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Dialog fullWidth maxWidth={'sm'} className={classes.rounded_dialog}
                    classes={{paper: classes.rounded_dialog}} open={open} onClose={onClose}>
                <DialogTitle className={classes.dialogTitle}>
                    {
                        (typeof title === "string")
                            ? <Typography variant="h6" className={classes.dialogText}>{title}</Typography>
                            : {title}
                    }
                </DialogTitle>
                <DialogContent>
                    <Grid container direction={"column"} spacing={2}>
                        {
                            description.map(
                                (item) =>
                                    (typeof item === "string")
                                        ? <Grid item xs>
                                            <Typography variant="body2"
                                                      className={classes.dialogText}>{item}</Typography>
                                        </Grid>
                                        : {item}
                            )
                        }
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} className={classes.buttonClose}>{closeLabel}</Button>
                    <Button onClick={onConfirm} className={classes.buttonConfirm}>{confirmLabel}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
