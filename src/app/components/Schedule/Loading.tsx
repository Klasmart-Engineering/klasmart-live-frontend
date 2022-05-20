import { Box, CircularProgress } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
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
        >
            <CircularProgress size={32}/>
        </Box>
    );
}
