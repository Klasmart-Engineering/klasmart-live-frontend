import { BaseConfirmDialog } from "./baseConfirmDialog";
import {
    Grid,
    Typography,
} from "@mui/material";
import React from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string[];
    closeLabel?: string;
    confirmLabel: string;
}

export function DetailConfirmDialog ({
    open, onClose, onConfirm,
    title, description,
    closeLabel, confirmLabel,
}: Props): JSX.Element {
    return (
        <BaseConfirmDialog
            open={open}
            title={title}
            closeLabel={closeLabel}
            confirmLabel={confirmLabel}
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
                                {(index === 0)
                                    ?
                                    <Typography
                                        variant="body2"
                                    >{descriptionItem}
                                    </Typography>
                                    :
                                    <Typography
                                        variant="caption"
                                        color={`textSecondary`}
                                    >{descriptionItem}
                                    </Typography>
                                }
                            </Grid>
                        ))}
            </Grid>
        </BaseConfirmDialog>
    );
}
