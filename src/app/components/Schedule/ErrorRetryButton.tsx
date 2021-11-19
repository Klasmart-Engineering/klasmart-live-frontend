import LoadingError from "@/assets/img/error/2.png";
import {
    Box,
    Button,
    createStyles,
    makeStyles,
    Typography,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    errorImage: {
        width: 200,
        height: 200,
    },
    errorText: {
        margin: theme.spacing(2, 0),
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
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={4}
        >
            <img
                src={LoadingError}
                className={classes.errorImage}
            />
            <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                className={classes.errorText}
            >
                <FormattedMessage id="schedule_errorFetchTimeViews" />
            </Typography>
            <Button
                size="large"
                onClick={onClick}
            >
                Retry
            </Button>
        </Box>
    );
}
