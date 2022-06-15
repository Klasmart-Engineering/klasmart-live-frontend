import NoScheDuleMobile from "@/assets/img/schedule-icon/no-schedule-mobile.svg";
import NoScheDuleTablet from "@/assets/img/schedule-icon/no-schedule-tablet.svg";
import {
    SCHEDULE_CARD_BACKGROUND_CONTAINER,
    SCHEDULE_NO_LIVE_CLASSES,
} from "@/config";
import { ClassType } from "@/store/actions";
import {
    Box,
    createStyles,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        justifyContent: `center`,
        backgroundColor: SCHEDULE_CARD_BACKGROUND_CONTAINER,
        height: `100%`,
    },
    text: {
        color: SCHEDULE_NO_LIVE_CLASSES,
        fontWeight: theme.typography.fontWeightBold as number,
        fontSize: `1.2rem`,
        paddingTop: theme.spacing(2.2),
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1.5rem`,
            paddingTop: theme.spacing(4.7),
        },
    },
}));

interface Props {
    variant?: ClassType;
}

export default function NoSchedule (props: Props) {
    const classes = useStyles();
    const { variant } = props;
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up(`md`));

    const noScheduleMessage = () => {
        switch (variant) {
        case ClassType.LIVE:
            return {
                defaultMessage: `No Live classes scheduled`,
                id: `schedule_liveNoSchedule`,
            };
        case ClassType.STUDY:
            return {
                defaultMessage: `No Study content scheduled`,
                id: `schedule_studyNoSchedule`,
            };
        default:
            return {
                defaultMessage: `No Live classes scheduled`,
                id: `schedule_liveNoSchedule`,
            };
        }
    };

    return (
        <Box className={classes.root}>
            <img
                alt="no schedule"
                src={isMdUp ? NoScheDuleTablet : NoScheDuleMobile}
            />
            <Typography className={classes.text}>
                <FormattedMessage
                    defaultMessage={noScheduleMessage().defaultMessage}
                    id={noScheduleMessage().id}
                />
            </Typography>
        </Box>
    );
}
