import { SCHEDULE_CARD_BACKGROUND_CONTAINER } from "@/config";
import {
    Box,
    CircularProgress,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    wrapper: {
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
        padding: theme.spacing(4),
        backgroundColor: SCHEDULE_CARD_BACKGROUND_CONTAINER,
        width: `100%`,
        height: `100%`,
    },
}));

interface Props {
}

export default function ScheduleLoading (props: Props) {
    const classes = useStyles();

    return (
        <Box
            className={classes.wrapper}
        >
            <CircularProgress size={32} />
        </Box>
    );
}
