import { Box, Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import * as QueryString from "query-string";
import * as React from "react";
import { withOrientationChange } from "react-device-detect";
import { useSelector, useStore } from "react-redux";
import { ActionTypes } from "../../store/actions";
import { State } from "../../store/store";
import AssessmentsLayout from "./assessments/assessments";
import LibraryLayout from "./library/library";
import LiveLayout from "./live/live";
import ReportLayout from "./report/report";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        layout: {
            flex: 1,
        },
        root: {
            height: "100%",
            paddingBottom: theme.spacing(4),
            paddingLeft: theme.spacing(5),
            paddingRight: theme.spacing(5),
            paddingTop: theme.spacing(4),
            width: "calc(100% - 2*1.5rem)",
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

export default function Home() {
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
    return (
        <Container
            disableGutters
            maxWidth={"lg"}
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
    );
}
