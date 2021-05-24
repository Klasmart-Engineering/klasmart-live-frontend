import {
    Button,
    Chip,
    Fade,
    Grid,
    makeStyles,
    TextField,
    Theme,
    Typography,
} from "@material-ui/core";
import amber from "@material-ui/core/colors/amber";
import { Star as StarEmptyIcon } from "@styled-icons/bootstrap/Star";
import { StarFill as StarFillIcon } from "@styled-icons/bootstrap/StarFill";
import clsx from "clsx";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles((theme: Theme) => ({
    stars:{
        marginTop: theme.spacing(3),
    },
    starsTitle:{},

    star:{
        opacity: 0.4,
        cursor: `pointer`,
        textAlign: `center`,
        "&:hover":{
            opacity: 1,
        },
    },
    starActive:{
        opacity: 1,
    },
    starUnclickable:{
        pointerEvents: `none`,
    },
    starLabel:{
        marginTop: 5,
    },
    rootChips: {
        display: `flex`,
        justifyContent: `center`,
        flexWrap: `wrap`,
        marginBottom: theme.spacing(2),
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
    moreTitle:{
        fontWeight: 600,
        marginTop: theme.spacing(2),
    },
    moreSubtitle:{
        color: theme.palette.grey[700],
        marginBottom: theme.spacing(2),
    },
    comment:{
        textAlign:`center`,
        color: theme.palette.text.primary,
    },
    chip:{
        fontSize: `0.75rem`,
        border: `1px solid rgb(206 206 206)`,
        color: `#a0a0a0`,
    },
    activeChip:{
        color:` #406ba7`,
        border: `1px solid #cfe1f9`,
        background: `#e6f1ff !important`,
    },
    inputField:{
        width: `100%`,
    },
    submitButton:{
        marginTop: 20,
    },
    starIcon:{
        color: amber[500],
    },
}));

export interface FeedbackProps {
    type: "student" | "teacher" | "leaving";
}

function getChoices (id:number) {
    const intl = useIntl();
    return {
        student : [
            intl.formatMessage({
                id: `feedback_student_video_${id}`,
            }),
            intl.formatMessage({
                id: `feedback_student_audio_${id}`,
            }),
            intl.formatMessage({
                id: `feedback_student_presentation_${id}`,
            }),
            intl.formatMessage({
                id: `feedback_student_other_${id}`,
            }),
        ],
        teacher : [
            intl.formatMessage({
                id: `feedback_teacher_video_${id}`,
            }),
            intl.formatMessage({
                id: `feedback_teacher_audio_${id}`,
            }),
            intl.formatMessage({
                id: `feedback_teacher_presentation_${id}`,
            }),
            intl.formatMessage({
                id: `feedback_teacher_other_${id}`,
            }),
        ],
        leaving : [
            `Appointment`,
            `Sick`,
            `Other`,
        ],
    };
}

function Feedback (props:FeedbackProps){
    const classes = useStyles();
    const intl = useIntl();

    const { type } = props;

    const [ feedbackNote, setFeedbackNote ] = useState<number|null>(null);
    const [ feedbackSent, setFeedbackSent ] = useState(false);

    const feedbackRatingItems = [
        {
            value: 1,
            label: intl.formatMessage({
                id: `feedback_not_so_good`,
            }),
            choices: getChoices(1),
        },
        {
            value: 2,
            label: intl.formatMessage({
                id: `feedback_bad`,
            }),
            choices: getChoices(2),
        },
        {
            value: 3,
            label: intl.formatMessage({
                id: `feedback_okay`,
            }),
            choices: getChoices(3),
        },
        {
            value: 4,
            label: intl.formatMessage({
                id: `feedback_good`,
            }),
            choices: getChoices(4),
        },
        {
            value: 5,
            label: intl.formatMessage({
                id: `feedback_awesome`,
            }),
            choices: getChoices(5),
        },
    ];

    return(
        <Grid
            container
            direction="column"
            alignItems="center">
            <Grid item>
                <div className={classes.stars}>
                    <Grid
                        container
                        spacing={3}>
                        {feedbackRatingItems.map(item => (
                            <Grid
                                key={item.value}
                                item>
                                <div
                                    className={clsx(classes.star, {
                                        [classes.starActive]: Number(feedbackNote) >= item.value,
                                        [classes.starUnclickable]: feedbackSent,
                                    })}
                                    onClick={() => setFeedbackNote(item.value)}
                                >
                                    {Number(feedbackNote) >= item.value ? <StarFillIcon
                                        size="2.5rem"
                                        className={classes.starIcon} /> : <StarEmptyIcon
                                        size="2.5rem"
                                        className={classes.starIcon}/> }
                                    {(feedbackNote === null || feedbackNote === item.value) && <Typography className={classes.starLabel}>{item.label}</Typography>}
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </Grid>
            {Boolean(feedbackNote) &&
            <Grid item>
                <Fade in={Boolean(feedbackNote)}>
                    <div>
                        {!feedbackSent &&
                        <>
                            <Typography className={classes.moreSubtitle}>
                                <FormattedMessage id="feedback_detail_question" />
                            </Typography>
                            <div className={classes.rootChips}>
                                {feedbackRatingItems.find(item => item.value === feedbackNote)?.choices[type].map((item, index) => (
                                    <FeedbackChip
                                        key={index}
                                        item={item} />
                                ))}
                            </div>
                            <form>
                                <TextField
                                    label="Leave a comment"
                                    className={classes.inputField}
                                />
                            </form>
                            <Button
                                className={classes.submitButton}
                                variant="contained"
                                color="primary"
                                onClick={() => setFeedbackSent(true)}>Submit</Button>
                        </>
                        }
                    </div>
                </Fade>
            </Grid>}
        </Grid>
    );
}

export { Feedback };

function FeedbackChip (props:any){
    const classes = useStyles();
    const { item } = props;
    const [ active, setActive ] = useState(false);

    return(
        <Chip
            label={item}
            variant="outlined"
            className={clsx(classes.chip, {
                [classes.activeChip]: active,
            })}
            onClick={() => setActive(!active)}/>
    );
}

export { FeedbackChip };
