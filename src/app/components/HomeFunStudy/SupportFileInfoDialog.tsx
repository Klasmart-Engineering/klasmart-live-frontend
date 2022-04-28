import { CordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import StyledIcon from "@/components/styled/icon";
import { BG_COLOR_GO_LIVE_BUTTON } from "@/config";
import {
    createStyles,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Theme,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import React,
{
    useContext,
    useEffect,
} from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) => createStyles({
    rounded_dialog: {
        borderRadius: theme.spacing(1.5),
    },
    dialogTitleText: {
        color: BG_COLOR_GO_LIVE_BUTTON,
        fontWeight: theme.typography.fontWeightBold as number,
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
        padding: theme.spacing(0, 3, 2),
    },
    supportFileCaption: {
        display: `inline-block`,
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightBold as number,
    },
    supportFileTypes: {
        display: `inline`,
    },
    supportMaxFileCaption: {
        display: `inline-block`,
        fontWeight: theme.typography.fontWeightBold as number,
        paddingBottom: theme.spacing(1),
    },
    supportMaxFileText: {
        display: `inline-block`,
        marginLeft: theme.spacing(1),
    },
}));

export default function SupportFileInfoDialog ({ open, onClose }: { open: boolean; onClose: () => void }): JSX.Element {
    const classes = useStyles();
    const {
        addOnBack,
        removeOnBack,
    } = useContext(CordovaSystemContext);

    useEffect(() => {
        const SUPPORT_FILE_INFO_BACK_ID = `supportFileInfoBackID`;
        if(open){
            addOnBack?.({
                id: SUPPORT_FILE_INFO_BACK_ID,
                onBack: () => {
                    handleCloseClick();
                },
            });
        }else{
            removeOnBack?.(SUPPORT_FILE_INFO_BACK_ID);
        }
    }, [open]);

    const handleCloseClick = () => {
        onClose();
    };

    return (
        <Dialog
            fullWidth
            maxWidth={`sm`}
            className={classes.rounded_dialog}
            classes={{
                paper: classes.rounded_dialog,
            }}
            open={open}
            onClose={onClose}>
            <DialogTitle>
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
                            variant="subtitle1"
                            className={classes.dialogTitleText}><FormattedMessage
                                id="homeFunStudy.supportFile.info.title"
                                defaultMessage="File Information"/>
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        onClick={handleCloseClick}
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
            <DialogContent className={classes.dialogContent}>
                <Grid
                    container
                    direction="column"
                    spacing={1}
                >
                    <Grid
                        item
                        xs>
                        <Typography
                            className={classes.supportMaxFileCaption}>
                            <FormattedMessage
                                id="homeFunStudy.supportFile.info.max"
                                defaultMessage="Maximum File Size: "/></Typography>
                        <Typography
                            color={`textSecondary`}
                            className={classes.supportMaxFileText}>
                            <FormattedMessage
                                id="support_file_size"
                                defaultMessage="100MB"/></Typography>
                    </Grid>
                    <Grid
                        item
                        xs>
                        <Typography
                            className={classes.supportFileCaption}>
                            <FormattedMessage
                                id="homeFunStudy.supportFile.info.fileType"
                                defaultMessage="Supported Files: "/></Typography>
                    </Grid>
                    <Grid
                        item
                        xs>
                        <Typography
                            className={classes.supportFileCaption}>
                            <FormattedMessage
                                id="homeFunStudy.supportFile.info.fileType"
                                defaultMessage="Supported Files: "/></Typography>
                        <Typography
                            color={`textSecondary`}
                            className={classes.supportFileTypes}>
                            <FormattedMessage
                                id="support_file_types"
                                defaultMessage="avi, mov, mp4, mp3, wav, jpg, jpeg, png, gif, bmp, doc, docx, ppt, pptx, xls, xlsx, pdf"/>
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}
