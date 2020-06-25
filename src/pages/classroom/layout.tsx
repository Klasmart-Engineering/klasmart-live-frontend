import { Box, Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import Slide from "@material-ui/core/Slide";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Zoom from "@material-ui/core/Zoom";
import clsx from "clsx";
import * as React from "react";
import { useState } from "react";
import { useSelector, useStore } from "react-redux";
import { ActionTypes } from "../../store/actions";
import { State } from "../../store/store";
import LibraryLayout from "./library/library";
import LiveLayout from "./live/live";
import NavBar from "./navbar/navbar";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        layout: {
            flex: 1,
        },
        root: {
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(2, 2),
            },
        },
        safeArea: {
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                paddingBottom: theme.spacing(2),
                paddingLeft: `max(${theme.spacing(2)},env(safe-area-inset-left)`,
                paddingRight: `max(${theme.spacing(2)},env(safe-area-inset-right)`,
                paddingTop: theme.spacing(2),
            },
        },
    }),
);

export default function Layout() {
    const classes = useStyles();
    const store = useStore();

    const activeComponent = useSelector((state: State) => state.ui.activeComponentHome);
    const setActiveComponent = (value: string) => {
        store.dispatch({ type: ActionTypes.ACTIVE_COMPONENT_HOME, payload: value });
    };

    const url = new URL(window.location.href);
    if (url.searchParams.get("component") !== "live") {
        setActiveComponent(url.searchParams.get("component") || "live");
    }

    const timeout = { enter: 500, exit: 100 };

    store.dispatch({ type: ActionTypes.LIVE_CLASS_TOGGLE, payload: false });

    return (
        <Grid
            container
            direction="column"
            justify="space-between"
            wrap="nowrap"
            className={classes.layout}
        >
            <NavBar />
            <Grid item xs={12}>
                <Container
                    disableGutters
                    maxWidth={"lg"}
                    className={clsx(classes.root, classes.safeArea)}
                >
                    <Grow in={activeComponent === "live"} timeout={timeout} mountOnEnter unmountOnExit>
                        <Box>
                            <LiveLayout />
                        </Box>
                    </Grow>
                    <Grow in={activeComponent === "library"} timeout={timeout} mountOnEnter unmountOnExit>
                        <Box>
                            <LibraryLayout />
                        </Box>
                    </Grow>
                    <Grow in={activeComponent === "people"} timeout={timeout} mountOnEnter unmountOnExit>
                        <Typography variant="h4">Coming soon!</Typography>
                    </Grow>
                    <Grow in={activeComponent === "assessments"} timeout={timeout} mountOnEnter unmountOnExit>
                        <Typography variant="h4">Coming soon!</Typography>
                    </Grow>
                </Container>
            </Grid>
        </Grid>
    );
}
