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
import NavBar from "./navbar/navbar";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
    }),
);

export function Layout() {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();

    return (
        <Grid container direction="row" justify="space-between">
            <NavBar />
            <Container
                    disableGutters
                    maxWidth={"lg"}
                >
                    Hello World!
            </Container>
        </Grid>
    );
}

export default Layout;
