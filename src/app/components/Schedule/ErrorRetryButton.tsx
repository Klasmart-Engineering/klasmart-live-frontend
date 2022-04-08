import LoadingError from "@/assets/img/error/5.svg";
import { BG_COLOR_SIGN_IN_BUTTON } from "@/config";
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
    img: {
        width: `35%`,
        height: `auto`,
        maxWidth: 220,
    },
    body: {
        margin: theme.spacing(2, 0, 3),
        fontWeight: theme.typography.fontWeightBold as number,
    },
    retryButton: {
        fontSize: `1rem`,
        lineHeight: 1.55,
        color: theme.palette.common.white,
        backgroundColor: BG_COLOR_SIGN_IN_BUTTON,
        fontWeight: theme.typography.fontWeightBold as number,
        padding: theme.spacing(1, 5.5),
        borderRadius: theme.spacing(1.5),

        [theme.breakpoints.up(`sm`)]: {
            fontSize: `1.4rem`,
            padding: theme.spacing(1, 7),
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
    const isSmUp = useMediaQuery(theme.breakpoints.up(`sm`));
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={4}
        >
            <img
                alt=""
                src={LoadingError}
                className={classes.img}
            />
            <Typography
                variant={isSmUp ? `h4`: `h5`}
                align="center"
                className={classes.body}
            >
                <FormattedMessage
                    values={{
                        br: <br />,
                    }}
                    id="schedule_errorFetchTimeViews"
                    defaultMessage="Oops!{br}Page loading failed."
                />
            </Typography>
            <Button
                disableElevation
                size="large"
                variant="contained"
                className={classes.retryButton}
                onClick={onClick}
            >
                <FormattedMessage
                    id="loading.error.retry"
                    defaultMessage="Retry"
                />
            </Button>
        </Box>
    );
}
