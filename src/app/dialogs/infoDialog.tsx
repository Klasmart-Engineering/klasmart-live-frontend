import { CloseIconButton } from "../components/icons/closeIconButton";
import { usePopupContext } from "../context-provider/popup-context";
import { useDeviceOrientationValue } from "../model/appModel";
import {
    HOME_FUN_STUDY_SUBMIT_BUTTON_BACKGROUND_COLOR,
    TEXT_COLOR_MENU_DRAWER,
} from "@/config";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
} from "@material-ui/core";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import clsx from "clsx";
import React,
{ useEffect } from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) => createStyles({
    rounded_dialog: {
        borderRadius: `12px`,
    },
    dialogLandscapeMaxWidth: {
        maxWidth: `50%`,
    },
    dialogTitle: {
        backgroundColor: HOME_FUN_STUDY_SUBMIT_BUTTON_BACKGROUND_COLOR,
    },
    dialogTitleText: {
        color: theme.palette.common.white,
    },
    dialogContent: {
        paddingTop: theme.spacing(1),
    },
    buttonClose: {
        backgroundColor: HOME_FUN_STUDY_SUBMIT_BUTTON_BACKGROUND_COLOR,
        color: theme.palette.common.white,
    },
}));

interface Props {
    open: boolean;
    title?: string;
    description: string[];
    closeLabel?: string;
    showCloseIcon: boolean;
    onClose: (reason?: "backdropClick" | "escapeKeyDown") => void;
}

export function InfoDialog ({
    open, onClose, title, description, closeLabel, showCloseIcon,
}: Props): JSX.Element {
    const classes = useStyles();
    const deviceOrientation = useDeviceOrientationValue();
    const { closePopup } = usePopupContext();

    const handleCloseClick = () => {
        onClose();
    };

    return (
        <React.Fragment>
            <Dialog
                fullWidth
                maxWidth={`sm`}
                className={classes.rounded_dialog}
                classes={{
                    paper: clsx(classes.rounded_dialog, {
                        [classes.dialogLandscapeMaxWidth]: deviceOrientation === `landscape-primary`
                            || deviceOrientation === `landscape-secondary`,
                    }),
                }}
                open={open}
                onClose={(event: object, reason: "backdropClick" | "escapeKeyDown") => {
                    onClose(reason);
                }}>
                <DialogTitle className={classes.dialogTitle}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        wrap="nowrap">
                        <Grid item>
                            <Typography className={classes.dialogTitleText}>
                                {
                                    title ? title : <FormattedMessage
                                        id="label_info"
                                        defaultMessage={`Info`} />
                                }
                            </Typography>
                        </Grid>
                        {showCloseIcon && <Grid item>
                            <CloseIconButton
                                buttonSize="small"
                                color={TEXT_COLOR_MENU_DRAWER}
                                onClick={() => closePopup()} />
                        </Grid>}
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <Grid
                        container
                        direction="column"
                        spacing={1}
                    >
                        {
                            description.map((item, index) =>
                                <Grid
                                    key={index}
                                    item
                                    xs>
                                    <Typography
                                        className={classes.dialogContent}
                                        component={`div`}
                                        variant="body2"
                                        color={`textSecondary`}><div dangerouslySetInnerHTML={{
                                            __html: item,
                                        }}/></Typography>
                                </Grid>)
                        }
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        className={classes.buttonClose}
                        onClick={handleCloseClick}>
                        {
                            closeLabel ? closeLabel : <FormattedMessage
                                id="button_ok"
                                defaultMessage={`Ok`}/>
                        }

                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
