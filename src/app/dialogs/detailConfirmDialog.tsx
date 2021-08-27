import { BaseConfirmDialog } from "./baseConfirmDialog";
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
            color: `#142C45`,
        },

    }));

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string[];
    closeLabel: string;
    confirmLabel: string;
}

export function DetailConfirmDialog ({
    open, onClose, onConfirm,
    title, description,
    closeLabel, confirmLabel,
}: Props): JSX.Element {
    const classes = useStyles();
    return (
        <BaseConfirmDialog
            open={open}
            title={title}
            closeLabel={closeLabel}
            confirmLabel={confirmLabel}
            onClose={onClose}
            onConfirm={onConfirm}>
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
                            {(index === 0)
                                ? <Typography
                                    variant="body2"
                                    className={classes.dialogText}>{item}</Typography>

                                : <Typography
                                    variant="caption"
                                    color={`textSecondary`}
                                >{item}</Typography>}
                        </Grid>)
                }
            </Grid>
        </BaseConfirmDialog>
    );
}
