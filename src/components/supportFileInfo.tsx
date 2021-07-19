import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography} from "@material-ui/core";
import React from "react";
import {FormattedMessage} from "react-intl";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    rounded_dialog: {
        borderRadius: "12px",
    },
    dialogTitle: {
        backgroundColor: "#3671CE",
    },
    dialogTitleText: {
        color: "white"
    },
    buttonClose: {
        color: "#3671CE"
    }
})

export function SupportFileInfo({open, onClose}: { open: boolean, onClose: () => void }): JSX.Element {
    const classes = useStyles();

    const handleCloseClick = () => {
        onClose();
    }

    return (
        <React.Fragment>
            <Dialog fullWidth maxWidth={'sm'} className={classes.rounded_dialog} classes={{paper: classes.rounded_dialog}} open={open} onClose={onClose}>
                <DialogTitle className={classes.dialogTitle}>
                    <Typography variant="h6" className={classes.dialogTitleText}><FormattedMessage
                        id="support_file_info_title"/></Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid
                        container
                        direction="column"
                        spacing={1}
                    >
                        <Grid item xs>
                            <Typography variant="h6"><FormattedMessage id="support_file_max_size"/>100MB</Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h6"><FormattedMessage id="support_files"/></Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body2" color={"textSecondary"}>Video (avi, mov, mp4)</Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body2" color={"textSecondary"}>Audio (mp3, wav)</Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body2" color={"textSecondary"}>Image (jpg, jpeg, png, gif,
                                bmp)</Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="body2" color={"textSecondary"}>Document (doc, docx, ppt, pptx, xls,
                                xlsx, pdf)</Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseClick} className={classes.buttonClose}><FormattedMessage id="button_close"/></Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
