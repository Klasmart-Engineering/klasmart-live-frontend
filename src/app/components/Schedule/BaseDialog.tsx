import BaseScheduleDialogContent,
{ DialogContentItem } from "./BaseDialogContent";
import {
    Box,
    Button,
    createStyles,
    Dialog,
    DialogActions,
    DialogTitle,
    makeStyles,
    PropTypes,
    Typography,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    dialogTitle: {
        backgroundColor: `#cce8f9`,
    },
    dialogTitleText: {
        color: `#193756`,
        textOverflow: `ellipsis`,
        overflow: `hidden`,
    },
}));

export interface DialogAction {
    align?: "start" | "end";
    color?: PropTypes.Color;
    label: string;
    disabled?: boolean;
    onClick: () => any;
}

export interface Props {
    title: string;
    contentItems: DialogContentItem[];
    actions: DialogAction[];
    open: boolean;
    onClose: () => void;
}

export default function BaseScheduleDialog (props: Props) {
    const {
        title,
        contentItems,
        actions,
        open,
        onClose,
    } = props;
    const classes = useStyles();

    return (
        <Dialog
            fullWidth
            maxWidth={`sm`}
            scroll={`paper`}
            open={open}
            onClose={onClose}
        >
            <DialogTitle className={classes.dialogTitle}>
                <Typography
                    noWrap
                    className={classes.dialogTitleText}
                >
                    {title}
                </Typography>
            </DialogTitle>
            <BaseScheduleDialogContent items={contentItems} />
            <DialogActions>
                {actions
                    .filter((action) => action.align === `start`)
                    .map((action, i) => (
                        <Button
                            key={`action-start-${i}`}
                            size={`large`}
                            variant={`contained`}
                            disabled={action.disabled}
                            color={action.color}
                            onClick={action.onClick}
                        >
                            {action.label}
                        </Button>
                    ))
                }
                <Box flex="1" />
                {actions
                    .filter((action) => action.align === `end` || !action.align)
                    .map((action, i) => (
                        <Button
                            key={`action-end-${i}`}
                            size={`large`}
                            variant={`contained`}
                            disabled={action.disabled}
                            color={action.color}
                            onClick={action.onClick}
                        >
                            {action.label}
                        </Button>
                    ))
                }
            </DialogActions>
        </Dialog>
    );
}
