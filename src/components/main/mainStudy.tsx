import { ClassContent } from "./classContent";
import {
    Box,
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    safeArea: {
        marginLeft: `env(safe-area-inset-left)`,
        marginRight: `env(safe-area-inset-right)`,
    },
    fullHeight: {
        width: `100%`,
        height: `100%`,
    },
}));

function MainStudy () {
    const classes = useStyles();

    return (
        <Grid
            container
            className={clsx(classes.fullHeight, {
                [classes.safeArea]: !process.env.IS_CORDOVA_BUILD,
            })}
        >
            <Grid
                item
                xs
            >
                <Box
                    py={4}
                    display="flex"
                    flexDirection="column"
                    height="100%"
                    boxSizing="border-box"
                >
                    <ClassContent />
                </Box>
            </Grid>
        </Grid>
    );
}

export default MainStudy;
