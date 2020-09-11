import { CircularProgress, Paper } from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector, useStore } from "react-redux";
import { State } from "../../../store/store";
import LiveCard from "./liveCard";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        liveButton: {
            backgroundColor: "#ff6961",
            color: "white",
        },
        liveTextWrapper: {
            backgroundColor: "#ff6961",
            borderRadius: 20,
            color: "white",
            fontSize: "0.6em",
            padding: theme.spacing(0.25, 0.75),
        },
        paperContainer: {
            borderRadius: 12,
            boxShadow: theme.palette.type === "dark" ? "0px 2px 4px -1px rgba(255, 255, 255, 0.25), 0px 4px 5px 0px rgba(255, 255, 255, 0.2), 0px 1px 10px 0px rgba(255, 255, 255, 0.16)" : "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
        },
        root: {
            height: "100%",
        },
    }),
);

export default function LiveLayout() {
    const classes = useStyles();
    const store = useStore();

    const [hasTransitioned, setHasTransitioned] = useState(false);
    const [inFlight, setInFlight] = useState(false);

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            className={classes.root}
            spacing={4}
        >
            <Grid item xs={12}>
                <Paper elevation={4} className={classes.paperContainer}>
                    <LiveCard />
                </Paper>
            </Grid>
        </Grid>
    );
}
