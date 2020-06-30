import { Box, Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import * as React from "react";
import { useSelector, useStore } from "react-redux";
import { ActionTypes } from "../../store/actions";
import { State } from "../../store/store";
import LibraryLayout from "./library/library";
import LiveLayout from "./live/live";
import AssessmentsLayout from "./assessments/assessments";
import ReportLayout from "./report/report";
import NavBar from "./navbar/navbar";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        layout: {
            flex: 1,
        },
        root: {
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(2, 1),
            },
        },
        safeArea: {
            paddingBottom: theme.spacing(4),
            paddingLeft: theme.spacing(5),
            paddingRight: theme.spacing(5),
            paddingTop: theme.spacing(4),
            [theme.breakpoints.down("sm")]: {
                paddingBottom: theme.spacing(2),
                paddingLeft: `max(${theme.spacing(1)}px,env(safe-area-inset-left)`,
                paddingRight: `max(${theme.spacing(1)}px,env(safe-area-inset-right)`,
                paddingTop: theme.spacing(2),
            },
        },
    }),
);

export default function Layout() {
    const classes = useStyles();
    const store = useStore();

    const { isIOS } = useSelector((state: State) => state.account.userAgent);
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
                    className={clsx(classes.root, isIOS ? classes.safeArea : "" )}
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
                    <Grow in={activeComponent === "assessments"} timeout={timeout} mountOnEnter unmountOnExit>
                        <Box>
                            <AssessmentsLayout />
                        </Box>
                    </Grow>
                    <Grow in={activeComponent === "report"} timeout={timeout} mountOnEnter unmountOnExit>
                        <Box>
                            <ReportLayout />
                        </Box>
                    </Grow>
                </Container>
            </Grid>
        </Grid>
    );
}
