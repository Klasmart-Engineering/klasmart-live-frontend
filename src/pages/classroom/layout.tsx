import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import clsx from "clsx";
import * as React from "react";
import { useStore } from "react-redux";
import { ActionTypes } from "../../store/actions";
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
                        <LiveLayout />
                </Container>
            </Grid>
        </Grid>
    );
}
