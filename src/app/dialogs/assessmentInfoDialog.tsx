import React from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";
import { BUTTON_CLOSE_PARENTAL_LOCK_BACKGROUND_COLOR, TEXT_COLOR_SECONDARY_DEFAULT } from "@/config";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";

import { Score, teacherFeedbacks } from "../components/HomeFunStudy/TeacherFeedback/FeedbackScore";

const useStyles = makeStyles((theme: Theme) => ({
    dialogTitle:{
        fontSize: `1.2rem`,
        padding: theme.spacing(2, 2, 0, 2),
        fontWeight: theme.typography.fontWeightBold as number,
    },
    wrapperDialog: {
        borderRadius: theme.spacing(3),
        padding: theme.spacing(0, 3),
    },
    feedbackIconCaption: {
        fontSize: `1rem`,
        display: `flex`,
        alignItems: `center`,
    },
    boxicon: {
        display: `flex`,
        width: theme.spacing(13),
        paddingRight: theme.spacing(4),
    },
    wrapperIcon: {
        display: `flex`,
        padding: theme.spacing(2, 1),
    },
    buttonClose: {
        backgroundColor: BUTTON_CLOSE_PARENTAL_LOCK_BACKGROUND_COLOR,
        marginBottom: theme.spacing(3),
        marginLeft: `auto`,
        marginRight: `auto`,
        fontSize: `1.2rem`,
        borderRadius: theme.spacing(2.5),
        padding: theme.spacing(0.5, 6),
        fontWeight: theme.typography.fontWeightMedium as number,
        color: TEXT_COLOR_SECONDARY_DEFAULT
    },
}));

export type Props = {
    visible: boolean;
    onClose: () => void;
}

export function AssessmentInfoDialog ({ visible, onClose }: Props) {

    const classes = useStyles();
    const intl = useIntl();

    return (
        <Dialog
            open={visible}
            PaperProps={{
                className: classes.wrapperDialog,
            }}
            onClose={onClose}
        >
            <DialogTitle>
                <Typography
                    className={classes.dialogTitle}
                >
                    <FormattedMessage
                        id="homeFunStudy.feedback.info.feedbackScale"
                        defaultMessage={`Feedback Scale`}
                    />
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Grid
                    container
                    direction="column"
                    spacing={2}
                >
                    {teacherFeedbacks.map(feedback => (
                        <Grid item className={classes.wrapperIcon}>
                            <Box className={classes.boxicon}>
                                <img
                                    src={feedback.icon}
                                />
                            </Box>
                            <Typography className={classes.feedbackIconCaption}>
                                <FormattedMessage id={`homeFunStudy.feedback.score.${feedback.name}`} />
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    autoFocus
                    disableRipple
                    color="primary"
                    className={classes.buttonClose}
                    onClick={onClose}
                >
                    {intl.formatMessage({
                        id: `button_close`,
                    })}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
