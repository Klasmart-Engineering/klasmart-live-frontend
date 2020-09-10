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
import NavBar from "./components/styled/navbar/navbar";
import AssessmentsLayout from "./pages/home/assessments/assessments";
import LibraryLayout from "./pages/home/library/library";
import LiveLayout from "./pages/home/live/live";
import ReportLayout from "./pages/home/report/report";
import { ActionTypes } from "./store/actions";
import { State } from "./store/store";

import { App } from "./app";
import MyContentList from "./pages/cms/cms-frontend-web/src/pages/MyContentList";

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

let Layout = (props: any) => {
    const classes = useStyles();

    return (
        <Grid
            container
            direction="column"
            justify="space-between"
            wrap="nowrap"
            className={classes.layout}
        >
            <Grid item xs={12}>
                <App />
            </Grid>
        </Grid>
    );
};

Layout = withOrientationChange(Layout);

export { Layout };
