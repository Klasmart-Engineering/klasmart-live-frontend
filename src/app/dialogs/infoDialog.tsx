import { CloseIconButton } from "../components/icons/closeIconButton";
import { usePopupContext } from "../context-provider/popup-context";
import { useDeviceOrientationValue } from "../model/appModel";
import {
    BG_COLOR_GO_LIVE_BUTTON,
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
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) => createStyles({
    rounded_dialog: {
        borderRadius: theme.spacing(1.5),
    },
    dialogLandscapeMaxWidth: {
        maxWidth: `50%`,
    },
    dialogTitle: {
        paddingBottom: theme.spacing(1),
    },
    dialogTitleText: {
        color: BG_COLOR_GO_LIVE_BUTTON,
        fontWeight: theme.typography.fontWeightBold as number,
    },
    dialogContent: {
        paddingTop: theme.spacing(1),
    },
    buttonClose: {
        backgroundColor: BG_COLOR_GO_LIVE_BUTTON,
        color: theme.palette.common.white,
        height: `2rem`,
        padding: theme.spacing(0, 2),
    },
    dialogActions: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(1),
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
                }}
            >
                <DialogTitle className={classes.dialogTitle}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        wrap="nowrap"
                    >
                        <Grid item>
                            <Typography
                                variant="subtitle1"
                                className={classes.dialogTitleText}
                            >
                                {
                                    title ? title :
                                        <FormattedMessage
                                            id="label_info"
                                            defaultMessage={`Info`}
                                        />
                                }
                            </Typography>
                        </Grid>
                        {showCloseIcon &&
                            <Grid item>
                                <CloseIconButton
                                    buttonSize="small"
                                    color={TEXT_COLOR_MENU_DRAWER}
                                    onClick={() => closePopup()}
                                />
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
                                (
                                    <Grid
                                        key={index}
                                        item
                                        xs
                                    >
                                        <Typography
                                            className={classes.dialogContent}
                                            component={`div`}
                                            variant="body1"
                                            color={`textPrimary`}
                                        >
                                            <div dangerouslySetInnerHTML={{
                                                __html: item,
                                            }}
                                            />
                                        </Typography>
                                    </Grid>
                                ))}
                    </Grid>
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <Button
                        className={classes.buttonClose}
                        onClick={handleCloseClick}
                    >
                        {
                            closeLabel ? closeLabel : <FormattedMessage
                                id="button_ok"
                                defaultMessage={`Ok`} />
                        }

                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
