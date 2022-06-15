import { SCHEDULE_CARD_BACKGROUND_CONTAINER } from "@/config";
import {
    Box,
    CircularProgress,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
}

export default function ScheduleLoading (props: Props) {
    const classes = useStyles();

    return (
        <Box
            display="flex"
            justifyContent="center"
            p={4}
            style={{
                backgroundColor: SCHEDULE_CARD_BACKGROUND_CONTAINER,
                width: `100%`,
                height: `100%`,
            }}
        >
            <CircularProgress size={32} />
        </Box>
    );
}
