import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles({
    rounded_dialog: {
        borderRadius: `12px`,
    },
    dialogTitle: {
        backgroundColor: `#3671CE`,
    },
    dialogTitleText: {
        color: `white`,
    },
    buttonClose: {
        color: `#3671CE`,
    },
});

interface Props {
    open: boolean;
    onClose: () => void;
    title?: string;
    description: string[];
    closeLabel?: string;
}

export function InfoDialog ({
    open, onClose, title, description, closeLabel,
}: Props): JSX.Element {
    const classes = useStyles();

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
                    paper: classes.rounded_dialog,
                }}
                open={open}
                onClose={onClose}>
                <DialogTitle className={classes.dialogTitle}>
                    <Typography className={classes.dialogTitleText}>
                        {
                            title? title : <FormattedMessage
                                id="label_info"
                                defaultMessage={`Info`}/>
                        }
                    </Typography>
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
                                        component={"div"}
                                        variant="body2"
                                        color={`textSecondary`}><div dangerouslySetInnerHTML={{__html: item}}/></Typography>
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
