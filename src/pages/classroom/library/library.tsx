import { Button, CircularProgress, Hidden, Paper, Typography } from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ArchiveTwoToneIcon from "@material-ui/icons/ArchiveTwoTone";
import HourglassFullTwoToneIcon from "@material-ui/icons/HourglassFullTwoTone";
import LocalLibraryTwoToneIcon from "@material-ui/icons/LocalLibraryTwoTone";
import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StyledButton from "../../../components/button";
import DialogAppBar from "../../../components/dialogAppBar";
import { State } from "../../../store/store";
import CreateDialog from "./createDialog";
import LessonPlanCard from "./libraryContentCard";
import LibraryView from "./libraryView";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        buttonSpacing: {
            margin: theme.spacing(0, 1),
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

export default function LibraryLayout() {
    const classes = useStyles();

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            className={classes.root}
            spacing={4}
        >
            <Grid
                container item
                justify="space-between"
                alignItems="center"
            >
                <Grid item xs={6}>
                    <CreateDialog />
                </Grid>
                <Hidden mdDown>
                    <Grid
                        container item
                        justify="flex-end"
                        xs={6}
                    >
                        <Button
                            color="primary"
                            className={classes.buttonSpacing}
                            size="large"
                            startIcon={<LocalLibraryTwoToneIcon style={{ color: "#444" }} />}
                        >
                            My Content
                        </Button>
                        <Button
                            color="primary"
                            className={classes.buttonSpacing}
                            size="large"
                            startIcon={<HourglassFullTwoToneIcon style={{ color: "#444" }} />}
                        >
                            Pending
                        </Button>
                        <Button
                            color="primary"
                            className={classes.buttonSpacing}
                            size="large"
                            startIcon={<ArchiveTwoToneIcon style={{ color: "#444" }} />}
                        >
                            Archived
                        </Button>
                    </Grid>
                </Hidden>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                    Content Library
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <LibraryView />
            </Grid>
        </Grid>
    );
}
