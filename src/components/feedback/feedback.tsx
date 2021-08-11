import {
    LIVE_LINK,
    LocalSessionContext,
} from '../../providers/providers';
import { MUTATION_SAVE_FEEDBACK } from "../../utils/graphql";
import { useMutation } from '@apollo/client';
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
import React,
{
    useContext,
    useEffect,
    useState,
} from "react";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

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
        marginTop: 8,
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
    starBox: {
        flexWrap: `nowrap`,
        whiteSpace: `nowrap`,
    },
}));

export interface FeedbackProps {
    type: "END_CLASS" | "LEAVE_CLASS";
}

function getChoices (feedbackType: string, userType: string, stars: number) {
    const intl = useIntl();
    feedbackType = feedbackType.toLowerCase();
    return [
        {
            text:  intl.formatMessage({
                id: `feedback_${feedbackType}_${userType}_video_${stars}`,
            }),
            type: `VIDEO`,
        },
        {
            text:   intl.formatMessage({
                id: `feedback_${feedbackType}_${userType}_audio_${stars}`,
            }),
            type: `AUDIO`,
        },
        {
            text:  intl.formatMessage({
                id: `feedback_${feedbackType}_${userType}_presentation_${stars}`,
            }),
            type: `PRESENTATION`,
        },
        {
            text: intl.formatMessage({
                id: `feedback_${feedbackType}_${userType}_other_${stars}`,
            }),
            type: `OTHER`,
        },
    ];
}

function Feedback (props:FeedbackProps){
    const classes = useStyles();
    const intl = useIntl();
    const { isTeacher } = useContext(LocalSessionContext);
    const userType = isTeacher ? `teacher`: `student`;
    const { type: feedbackType } = props;

    const [ stars, setStars ] = useState<number|null>(null);
    const [ feedbackSent, setFeedbackSent ] = useState<boolean>(false);
    const [ quickFeedback, setQuickFeedback ] = useState<Array<any>>(new Array<any>());
    const [ comment, setComment ] = useState<string>(``);

    const [ saveFeedbackMutation ] = useMutation(MUTATION_SAVE_FEEDBACK, {
        context: {
            target: LIVE_LINK,
        },
    });

    useEffect(() => setQuickFeedback([]), [ stars ]);

    const onQuickFeedback = (type: string, active: boolean) => {
        let qFeedback = quickFeedback;
        if(active) {
            qFeedback.push({
                type,
                stars,
            });
        } else {
            qFeedback = qFeedback.filter(item => item.type !== type);
        }
        setQuickFeedback(qFeedback);
    };

    const onSubmit = () => {
        saveFeedbackMutation({
            variables: {
                stars,
                feedbackType,
                comment,
                quickFeedback,
            },
        });
        setFeedbackSent(true);
    };

    const feedbackRatingItems = [
        {
            value: 1,
            label: intl.formatMessage({
                id: `feedback_not_so_good`,
            }),
            choices: getChoices(feedbackType, userType, 1),
        },
        {
            value: 2,
            label: intl.formatMessage({
                id: `feedback_bad`,
            }),
            choices: getChoices(feedbackType, userType, 2),
        },
        {
            value: 3,
            label: intl.formatMessage({
                id: `feedback_okay`,
            }),
            choices: getChoices(feedbackType, userType, 3),
        },
        {
            value: 4,
            label: intl.formatMessage({
                id: `feedback_good`,
            }),
            choices: getChoices(feedbackType, userType, 4),
        },
        {
            value: 5,
            label: intl.formatMessage({
                id: `feedback_awesome`,
            }),
            choices: getChoices(feedbackType, userType, 5),
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
                        className={classes.starBox}
                        spacing={3}>
                        {feedbackRatingItems.map(item => (
                            <Grid
                                key={item.value}
                                item>
                                <div
                                    className={clsx(classes.star, {
                                        [classes.starActive]: Number(stars) >= item.value,
                                        [classes.starUnclickable]: feedbackSent,
                                    })}
                                    onClick={() => setStars(item.value)}
                                >
                                    {Number(stars) >= item.value ? <StarFillIcon
                                        size="2.5rem"
                                        className={classes.starIcon} /> : <StarEmptyIcon
                                        size="2.5rem"
                                        className={classes.starIcon}/> }
                                    {(stars === null || stars === item.value) && <Typography className={classes.starLabel}>{item.label}</Typography>}
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </Grid>
            {Boolean(stars) &&
            <Grid item>
                <Fade in={Boolean(stars)}>
                    <div>
                        {!feedbackSent &&
                        <div>
                            <Typography className={classes.moreSubtitle}>
                                <FormattedMessage id="feedback_detail_question" />
                            </Typography>
                            <div className={classes.rootChips}>
                                {feedbackRatingItems.find(item => item.value === stars)?.choices.map((item: any, index: number) => (
                                    <FeedbackChip
                                        key={`${stars}_${index}`}
                                        item={item}
                                        onQuickFeedback={onQuickFeedback} />
                                ))}
                            </div>
                            <form>
                                <TextField
                                    label={intl.formatMessage({
                                        id: `feedback_comment`,
                                    })}
                                    className={classes.inputField}
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                />
                            </form>
                            <Button
                                className={classes.submitButton}
                                variant="contained"
                                color="primary"
                                onClick={() => onSubmit()}><FormattedMessage id="common_submit" /></Button>
                        </ div>}
                    </div>
                </Fade>
            </Grid>}
        </Grid>
    );
}

export { Feedback };

function FeedbackChip (props:any){
    const classes = useStyles();
    const { item, onQuickFeedback } = props;
    const [ active, setActive ] = useState(false);

    useEffect(() => onQuickFeedback(item.type, active), [ active ]);

    return(
        <Chip
            label={item.text}
            variant="outlined"
            className={clsx(classes.chip, {
                [classes.activeChip]: active,
            })}
            onClick={() => setActive(!active)}/>
    );
}

export { FeedbackChip };
