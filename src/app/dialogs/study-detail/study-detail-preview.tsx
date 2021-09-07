import { useHttpEndpoint } from "../../../providers/region-select-context";
import {
    AppBar,
    Dialog,
    DialogContent,
    Grid,
    IconButton,
    makeStyles,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import React,
{ useMemo } from "react";

const useStyles = makeStyles(() => ({
    appBar: {
        backgroundColor: `#cce8f9`,
        position: `relative`,
    },
    dialogTitleText: {
        color: `#193756`,
        textOverflow: `ellipsis`,
        overflow: `hidden`,
    },
    imageContainer: {
        height: `100%`,
    },
    imagePreview: {
        maxHeight: `100%`,
        width: `100%`,
    },
}));

export default function StudyDetailPreview ({
    open, onClose, attachmentId, attachmentName,
}: {
    open: boolean;
    onClose: () => void;
    attachmentId?: string;
    attachmentName?: string;
}) {

    const {
        appBar,
        dialogTitleText,
        imageContainer,
        imagePreview,
    } = useStyles();

    const cms = useHttpEndpoint(`cms`);

    const attachmentDownloadLink = useMemo<string | undefined>(() => {
        if (attachmentId) {
            return `${cms}/v1/contents_resources/${attachmentId}`;
        } else {
            return undefined;
        }
    }, [ attachmentId ]);

    const closeButtonHandler = () => {
        onClose();
    };

    return (
        <React.Fragment>
            <Dialog
                fullScreen
                scroll={`paper`}
                open={open}
                onClose={closeButtonHandler}>
                <AppBar className={appBar}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            size={`medium`}
                            aria-label="close"
                            onClick={closeButtonHandler}>
                            <CloseIcon size={`42`} />
                        </IconButton>
                        <Grid
                            container
                            item
                            justify={`center`}
                            alignItems={`center`}>
                            <Typography
                                variant="h6"
                                className={dialogTitleText}>
                                {attachmentName}
                            </Typography>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <Grid
                        container
                        item
                        xs
                        className={imageContainer}
                        justify={`center`}
                        alignItems={`center`}>
                        <img
                            className={imagePreview}
                            src={attachmentDownloadLink} />
                    </Grid>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
