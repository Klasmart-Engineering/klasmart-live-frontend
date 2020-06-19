import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import * as React from "react";
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
    }),
);

export default function Layout() {
    const classes = useStyles();

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
                        className={classes.root}
                    >
                        <LiveLayout />
                </Container>
            </Grid>
        </Grid>
    );
}
