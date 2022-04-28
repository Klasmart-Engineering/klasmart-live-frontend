import { BaseErrorDialog } from "./baseErrorDialog";
import { TEXT_COLOR_PRIMARY_DEFAULT } from "@/config";
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
        dialogText: {
            color: TEXT_COLOR_PRIMARY_DEFAULT,
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
                                className={classes.dialogText}>{item}</Typography>
                        </Grid>)
                }
            </Grid>
        </BaseErrorDialog>
    );
}
