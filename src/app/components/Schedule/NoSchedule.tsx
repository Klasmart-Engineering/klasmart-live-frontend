import NoScheduleStudy from "@/assets/img/icon_no_homework.svg";
import NoScheduleStudyTip from "@/assets/img/icon_no_homework_tip.svg";
import NoScheduleLive from "@/assets/img/icon_no_schedule.svg";
import NoScheduleLiveTip from "@/assets/img/icon_no_schedule_tip.svg";
import {
    BG_BUTTON_STUDY_COLOR,
    TEXT_COLOR_LIVE_PRIMARY,
    TEXT_COLOR_STUDY_PRIMARY,
    THEME_COLOR_BACKGROUND_BLUE,
} from "@/config";
import {
    createStyles,
    Grid,
    makeStyles,
    Typography,
    useTheme,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        position: `relative`,
    },
    text: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        width: `30%`,
        borderRadius: 25,
        bottom: 10,
        position: `relative`,
        padding: `10px 20px`,
        [theme.breakpoints.down(`xs`)]: {
            width: `60%`,
        },
    },
    textTip:{
        content: `''`,
        position: `absolute`,
        width: 30,
        height: 30,
        backgroundRepeat: `no-repeat`,
        bottom: -25,
        marginLeft: theme.spacing(3),
    },
    image: {
        width: `70%`,
        [theme.breakpoints.down(`xs`)]: {
            width: `100%`,
        },
    },
}));

export enum NoScheduleVariant {
    LIVE,
    STUDY,
}

interface Props {
    variant?: NoScheduleVariant;
}

export default function NoSchedule (props: Props) {
    const classes = useStyles();
    const { variant } = props;
    const theme = useTheme();

    let image = NoScheduleLive;
    let text = `schedule_liveNoSchedule`;
    let textTip = NoScheduleLiveTip;
    let textBackground = THEME_COLOR_BACKGROUND_BLUE;
    let textColor = TEXT_COLOR_LIVE_PRIMARY;

    if(variant === NoScheduleVariant.STUDY){
        image = NoScheduleStudy;
        text = `schedule_studyNoSchedule`;
        textTip = NoScheduleStudyTip;
        textBackground = BG_BUTTON_STUDY_COLOR;
        textColor = TEXT_COLOR_STUDY_PRIMARY;
    }

    return (
        <Grid
            container
            className={classes.root}
            alignItems="center"
            justifyContent="center"
            direction="column">
            <Grid
                item
                className={classes.text}
                style={{
                    backgroundColor: textBackground,
                    color: textColor,
                }}>
                <Typography
                    style={{
                        fontWeight: theme.typography.fontWeightBold,
                    }}
                    variant="h5"
                    align="center">
                    <FormattedMessage id={text} />
                </Typography>
                <div
                    className={classes.textTip}
                    style={{
                        backgroundImage: `url(${textTip})`,
                    }}></div>
            </Grid>
            <Grid
                item
                className={classes.image}>
                <img
                    alt="No Schedule"
                    src={image}
                />
            </Grid>
        </Grid>
    );
}
