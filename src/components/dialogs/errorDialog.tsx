import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Grid, Typography} from "@material-ui/core";
import {BaseErrorDialog} from "./baseErrorDialog";

const useStyles = makeStyles(() =>
    createStyles({
        rounded_dialog: {
            borderRadius: "12px",
        },
        dialogTitle: {
            backgroundColor: "#FF5C5C",
        },
        dialogText: {
            color: "#193756"
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
    description: string[],
    closeLabel: string,
}

export function ErrorDialog({
                                      open, onClose,
                                      title, description,
                                      closeLabel
                                  }: Props): JSX.Element {
    const classes = useStyles();
    return (
        <BaseErrorDialog open={open} onClose={onClose} title={title} closeLabel={closeLabel}>
            <Grid container direction={"column"} spacing={2}>
                {
                    description.map(
                        (item, index) =>
                            <Grid key={index} item xs>
                                <Typography variant="body2"
                                            className={classes.dialogText}>{item}</Typography>
                            </Grid>
                    )
                }
            </Grid>
        </BaseErrorDialog>
    )
}
