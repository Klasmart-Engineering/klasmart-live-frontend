import BaseScheduleDialogContent,
{ DialogContentItem } from "./BaseDialogContent";
import Loading from "@/components/loading";
import StyledIcon from "@/components/styled/icon";
import {
    Box,
    Button,
    createStyles,
    Dialog,
    DialogActions,
    DialogTitle,
    Grid,
    makeStyles,
    PropTypes,
    Typography,
} from "@material-ui/core";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    dialogTitle: {
        backgroundColor: `#cce8f9`,
    },
    dialogTitleText: {
        color: `#193756`,
        textOverflow: `ellipsis`,
        overflow: `hidden`,
        marginRight: 8,
    },
    dialogCloseIconButton: {
        borderRadius: `50%`,
        width: `2rem`,
        height: `2rem`,
        background: theme.palette.common.white,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    dialogContent: {
        position: `relative`,
    },
    dialogLoadingContent: {
        position: `absolute`,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: `center`,
        alignItems: `center`,
        backgroundColor: `white`,
        display: `flex`,
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
    isLoading: boolean;
    onClose: () => void;
}

export default function BaseScheduleDialog (props: Props) {
    const {
        title,
        contentItems,
        actions,
        open,
        isLoading,
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
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    wrap="nowrap"
                >
                    <Grid
                        item
                        style={{
                            overflowX: `hidden`,
                        }}>
                        <Typography
                            noWrap
                            className={classes.dialogTitleText}
                        >
                            {title}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        onClick={onClose}
                    >
                        <div className={classes.dialogCloseIconButton}>
                            <StyledIcon
                                icon={<CloseIcon />}
                                size={`large`}
                            />
                        </div>
                    </Grid>
                </Grid>
            </DialogTitle>
            <div className={classes.dialogContent}>
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
                {isLoading && (<div className={classes.dialogLoadingContent}>
                    <Loading />
                </div>)}
            </div>
        </Dialog>
    );
}
