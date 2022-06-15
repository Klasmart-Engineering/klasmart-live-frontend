import LoadingFailedMobile from "@/assets/img/schedule-icon/loading-failed-mobile.svg";
import LoadingFailedTablet from "@/assets/img/schedule-icon/loading-failed-tablet.svg";
import RetryIconMobile from "@/assets/img/schedule-icon/try-again-mobile.svg";
import RetryIconTablet from "@/assets/img/schedule-icon/try-again-tablet.svg";
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

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
        flexDirection: `column`,
        height: `100%`,
        backgroundColor: SCHEDULE_CARD_BACKGROUND_CONTAINER,
    },
    img: {},
    body: {
        fontWeight: theme.typography.fontWeightBold as number,
        color: SCHEDULE_NO_LIVE_CLASSES,
        padding: theme.spacing(0.5, 0, 2.2),
        fontSize: `1.15rem`,
        [theme.breakpoints.up(`sm`)]: {
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
        [theme.breakpoints.up(`sm`)]: {
            fontSize: `1.3rem`,
            padding: theme.spacing(1, 6),
        },
    },
}));

interface Props {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function ScheduleErrorRetryButton (props: Props) {
    const { onClick } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up(`md`));
    return (
        <Box
            className={classes.root}
        >
            <img
                alt=""
                src={isMdUp ? LoadingFailedTablet : LoadingFailedMobile}
                className={classes.img}
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
                        src={isMdUp ? RetryIconTablet : RetryIconMobile}
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
