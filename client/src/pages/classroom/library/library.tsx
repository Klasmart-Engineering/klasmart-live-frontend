import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArchiveTwoToneIcon from "@material-ui/icons/ArchiveTwoTone";
import HourglassFullTwoToneIcon from "@material-ui/icons/HourglassFullTwoTone";
import LocalLibraryTwoToneIcon from "@material-ui/icons/LocalLibraryTwoTone";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useStore, useSelector } from "react-redux";
import { State } from "../../../store/store";
import { ActionTypes, LibraryMenu } from "../../../store/actions"
import CreateDialog from "./createDialog";
import LibraryContentView from "./libraryContentView";
import LibraryPendingView from "./libraryPendingView";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        buttonSpacing: {
            margin: theme.spacing(0, 1),
        },
        root: {
            height: "100%",
        },
    }),
);

export default function LibraryLayout() {
    const classes = useStyles();
    const store = useStore();

    const activeMenu = useSelector((state: State) => state.ui.activeLibraryMenu);
    const setActiveMenu = (value: LibraryMenu) => {
        store.dispatch({ type: ActionTypes.ACTIVE_LIBRARY_MENU, payload: value });
    };
    const isLive = useSelector((state: State) => state.ui.liveClass);
    const toggleLive = () => {
        store.dispatch({ type: ActionTypes.LIVE_CLASS_TOGGLE, payload: false });
    };
    useEffect(() => {
        if (isLive) { toggleLive(); }
    }, [])

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
                <Grid
                    container item
                    justify="flex-end"
                    xs={6}
                >
                    <Button
                        color="primary"
                        className={classes.buttonSpacing}
                        size="large"
                        onClick={() => setActiveMenu("content")}
                        startIcon={<LocalLibraryTwoToneIcon style={{ color: "#444" }} />}
                    >
                        <FormattedMessage id="library_contentButton" />
                    </Button>
                    <Button
                        color="primary"
                        className={classes.buttonSpacing}
                        size="large"
                        onClick={() => setActiveMenu("pending")}
                        startIcon={<HourglassFullTwoToneIcon style={{ color: "#444" }} />}
                    >
                        <FormattedMessage id="library_pendingButton" />
                    </Button>
                    <Button
                        color="primary"
                        className={classes.buttonSpacing}
                        size="large"
                        onClick={() => setActiveMenu("archived")}
                        startIcon={<ArchiveTwoToneIcon style={{ color: "#444" }} />}
                    >
                        <FormattedMessage id="library_archivedButton" />
                    </Button>
                </Grid>
            </Grid>
            <LibraryContent activeMenu={activeMenu} />
        </Grid>
    );
}

function LibraryContent(props: { activeMenu: string }) {
    switch (props.activeMenu) {
        case "content":
            return (
                <>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">
                            <FormattedMessage id="library_contentTitle" />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <LibraryContentView />
                    </Grid>
                </>
            )
        case "pending":
            return (
                <>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">
                            <FormattedMessage id="library_pendingTitle" />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <LibraryPendingView />
                    </Grid>
                </>
            )
        case "archived":
            return (
                <>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">
                            <FormattedMessage id="library_archivedTitle" />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        Coming soon
                    </Grid>
                </>
            )
        default:
            return (
                <>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">
                            <FormattedMessage id="library_contentTitle" />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <LibraryContentView />
                    </Grid>
                </>
            )
    }
}
