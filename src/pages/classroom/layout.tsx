import { Container, useMediaQuery, useTheme } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import ReactPlayer from "react-player/lazy";
import { useHistory } from "react-router-dom";
import Copyright from "../../components/copyright";
import LiveLayout from "./live/live";
import NavBar from "./navbar/navbar";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        layout: {
            flex: 1,
        },
        root: {
            // height: "100%",
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(2, 2),
            },
        },
    }),
);

export default function Layout() {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();

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
