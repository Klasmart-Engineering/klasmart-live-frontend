import { BaseConfirmDialog } from "./baseConfirmDialog";
import {
    Grid,
    Typography,
} from "@material-ui/core";
import React from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string[];
    closeLabel?: string;
    confirmLabel: string;
    showCloseIcon?: boolean;
}

export function ConfirmDialog ({
    open, onClose, onConfirm,
    title, description,
    closeLabel, confirmLabel, showCloseIcon,
}: Props): JSX.Element {
    return (
        <BaseConfirmDialog
            open={open}
            title={title}
            closeLabel={closeLabel}
            confirmLabel={confirmLabel}
            showCloseIcon={showCloseIcon}
            onClose={onClose}
            onConfirm={onConfirm}
        >
            <Grid
                container
                direction={`column`}
                spacing={2}
            >
                {
                    description.map((descriptionItem, index) =>
                        (
                            <Grid
                                key={index}
                                item
                                xs
                            >
                                <Typography
                                    variant="body2"
                                >{descriptionItem}
                                </Typography>
                            </Grid>
                        ))}
            </Grid>
        </BaseConfirmDialog>
    );
}
