import LoadingFailed from "@/assets/img/schedule-icon/loading-failed-mobile.svg";
import RetryIcon from "@/assets/img/schedule-icon/try-again-mobile.svg";
import {
    SCHEDULE_CARD_BACKGROUND_CONTAINER,
    SCHEDULE_CARD_SEE_DETAILS,
    SCHEDULE_NO_LIVE_CLASSES,
    TEXT_COLOR_CONSTRAST_DEFAULT,
} from "@/config";
import {
    Box,
    Button,
    createStyles,
    makeStyles,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

const LOADING_FAILED_ICON_WIDTH_MEDIUM = 94;
const LOADING_FAILED_ICON_HEIGHT_MEDIUM = 109;
const RETRY_ICON_WIDTH_MEDIUM = 12;

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
        flexDirection: `column`,
        height: `100%`,
        backgroundColor: SCHEDULE_CARD_BACKGROUND_CONTAINER,
    },
    body: {
        fontWeight: theme.typography.fontWeightBold as number,
        color: SCHEDULE_NO_LIVE_CLASSES,
        padding: theme.spacing(0.5, 0, 2.2),
        fontSize: `1.15rem`,
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1.7rem`,
            padding: theme.spacing(1, 0, 3.5),
        },
    },
    retryButton: {
        fontSize: `0.9rem`,
        color: TEXT_COLOR_CONSTRAST_DEFAULT,
        backgroundColor: SCHEDULE_CARD_SEE_DETAILS,
        fontWeight: theme.typography.fontWeightBold as number,
        padding: theme.spacing(0.7, 4),
        borderRadius: theme.spacing(1),
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1.3rem`,
            padding: theme.spacing(1, 6),
        },
    },
    loadingFailedIcon: {
        [theme.breakpoints.up(`md`)]: {
            width: LOADING_FAILED_ICON_WIDTH_MEDIUM,
            height: LOADING_FAILED_ICON_HEIGHT_MEDIUM,
        },
    },
    retryIcon: {
        [theme.breakpoints.up(`md`)]: {
            width: RETRY_ICON_WIDTH_MEDIUM,
            height: RETRY_ICON_WIDTH_MEDIUM,
        },
    },
}));

interface Props {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function ScheduleErrorRetryButton (props: Props) {
    const { onClick } = props;
    const classes = useStyles();
    return (
        <Box
            className={classes.root}
        >
            <img
                alt="loading failed"
                src={LoadingFailed}
                className={classes.loadingFailedIcon}
            />
            <Typography
                className={classes.body}
            >
                <FormattedMessage
                    values={{
                        br: ` `,
                    }}
                    id="schedule_errorFetchTimeViews"
                    defaultMessage="Oops!{br}Page loading failed."
                />
            </Typography>
            <Button
                disableElevation
                className={classes.retryButton}
                endIcon={
                    <img
                        alt="retry"
                        src={RetryIcon}
                        className={classes.retryIcon}
                    />
                }
                onClick={onClick}
            >
                <FormattedMessage
                    id="loading_try_again"
                    defaultMessage="Try again"
                />
            </Button>
        </Box>
    );
}
