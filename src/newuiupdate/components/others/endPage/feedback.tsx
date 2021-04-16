import {
    Typography,
    Grid,
    makeStyles,
    Theme,
    Button,
    Fade,
    Chip,
    TextField
} from "@material-ui/core";
import React, { useState } from "react";

import clsx from "clsx";

import { Star as StarEmptyIcon } from "@styled-icons/bootstrap/Star";
import { StarFill as StarFillIcon } from "@styled-icons/bootstrap/StarFill";


const useStyles = makeStyles((theme: Theme) => ({
    stars:{
        marginTop: theme.spacing(3)
    },
    starsTitle:{},
   
    star:{
        opacity: 0.4,
        cursor: 'pointer',
        textAlign: 'center',
        "&:hover":{
            opacity: 1
        }
    },
    starActive:{
        opacity: 1,
    },
    starUnclickable:{
        pointerEvents: 'none',
    },
    starLabel:{
        marginTop: 5,
    },
    rootChips: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: theme.spacing(2),
        '& > *': {
        margin: theme.spacing(0.5),
        },
    },
    moreTitle:{
        fontWeight: 600,
        marginTop: theme.spacing(2)
    },
    moreSubtitle:{
        color: theme.palette.grey[700],
        marginBottom: theme.spacing(2)
    },
    comment:{
        textAlign:'center',
        color: theme.palette.text.primary
    },
    chip:{
        fontSize: '0.75rem',
        border: '1px solid rgb(206 206 206)',
        color: '#a0a0a0',
    },
    activeChip:{
        color:' #406ba7',
        border: '1px solid #cfe1f9',
        background: '#e6f1ff !important',
    },
    inputField:{
        width: '100%'
    },
    submitButton:{
        marginTop: 20
    }
}));


const feedbackRatingItems = [
    {
        value: 1,
        label: 'Terrible',
        choices: ["Couldn't join the class", "Bad audio/video"]
    },{
        value: 2,
        label: 'Bad',
        choices: ["Teacher unprofessionnal", "Tools are not adapted", "Low quality audio/video"]
    },{
        value: 3,
        label: 'Okay',
        choices: ["Materials could be better", "Too much noise"]
    },{
        value: 4,
        label: 'Good',
        choices: ["Teacher was exemplary", "good audio/video quality", "Materials were adequate"]
    },{
        value: 5,
        label: 'Great',
        choices: ["Teacher was amazing", "Great audio/video quality", "Materials were great"]
    }
]

function Feedback(props:any){
    const classes = useStyles();
   
    const [ feedbackNote, setFeedbackNote ] = useState<Number|null>(null);
    const [ feedbackSent, setFeedbackSent ] = useState(false);

    return(
        <Grid container direction="column" alignItems="center">
            <Grid item>
                <div className={classes.stars}>
                    <Grid container spacing={3}>
                        {feedbackRatingItems.map(item => (
                            <Grid item>
                                <div 
                                    onClick={() => setFeedbackNote(item.value)} 
                                    className={clsx(classes.star, {
                                        [classes.starActive]: Number(feedbackNote) >= item.value, 
                                        [classes.starUnclickable]: feedbackSent})}
                                >
                                    {Number(feedbackNote) >= item.value ? <StarFillIcon size="2.5rem"/> : <StarEmptyIcon size="2.5rem"/> }
                                    {(feedbackNote === null || feedbackNote === item.value) && <Typography className={classes.starLabel}>{item.label}</Typography>}
                                </div>
                             </Grid>
                        ))}
                    </Grid>
                </div>
            </Grid>
            <Grid item>
                <Fade in={Boolean(feedbackNote)}>
                    <div>
                        <Typography className={classes.moreTitle}>Thanks for your feedback!</Typography>
                        {!feedbackSent &&
                            <>
                                 <Typography className={classes.moreSubtitle}>do you want to add more details ?</Typography>
                                <div className={classes.rootChips}>
                                    {feedbackRatingItems.find(item => item.value === feedbackNote)?.choices.map(item => (
                                            <FeedbackChip item={item} />
                                    ))}
                                </div>
                                <form>
                                    <TextField
                                        label="Leave a comment"
                                        className={classes.inputField}
                                    />
                                </form>
                                <Button className={classes.submitButton} variant="contained" color="primary" onClick={() => setFeedbackSent(true)}>Submit</Button>
                            </>
                        }
                    </div>
                </Fade>
            </Grid>
        </Grid>
    )
}

export { Feedback }


function FeedbackChip(props:any){
    const classes = useStyles();
    const { item } = props;
    const [ active, setActive ] = useState(false);

    return(
        <Chip label={item} variant="outlined" onClick={() => setActive(!active)} className={clsx(classes.chip, {[classes.activeChip]: active })}/>
    )
}

export { FeedbackChip }