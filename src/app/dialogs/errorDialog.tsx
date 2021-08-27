import { BaseErrorDialog } from "./baseErrorDialog";
import {
    Grid,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(() =>
    createStyles({
        rounded_dialog: {
            borderRadius: `12px`,
        },
        dialogTitle: {
            backgroundColor: `#FF5C5C`,
        },
        dialogText: {
            color: `#193756`,
        },
        buttonClose: {
            color: `white`,
            backgroundColor: `#193756`,
            borderRadius: 15,
        },
    }));

interface Props {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string[];
    closeLabel: string;
}

export function ErrorDialog ({
    open, onClose,
    title, description,
    closeLabel,
}: Props): JSX.Element {
    const classes = useStyles();
    return (
        <BaseErrorDialog
            open={open}
            title={title}
            closeLabel={closeLabel}
            onClose={onClose}>
            <Grid
                container
                direction={`column`}
                spacing={2}>
                {
                    description.map((item, index) =>
                        <Grid
                            key={index}
                            item
                            xs>
                            <Typography
                                variant="body2"
                                className={classes.dialogText}>{item}</Typography>
                        </Grid>)
                }
            </Grid>
        </BaseErrorDialog>
    );
}
