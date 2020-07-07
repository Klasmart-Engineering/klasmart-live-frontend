import Hidden from "@material-ui/core/Hidden";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import LocalLibraryTwoToneIcon from "@material-ui/icons/LocalLibraryTwoTone";
import HourglassFullTwoToneIcon from "@material-ui/icons/HourglassFullTwoTone";
import ArchiveTwoToneIcon from "@material-ui/icons/ArchiveTwoTone";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useStore, useSelector } from "react-redux";
import { State } from "../../../store/store";
import { ActionTypes, LibraryMenu } from "../../../store/actions"
import CreateDialog from "./createDialog";
import LibraryContentView from "./libraryContentView";
import LibraryPendingView from "./libraryPendingView";

type ContentLibraryMenuItem = {
    id: string;
    icon: JSX.Element;
    text: JSX.Element;
}

const MENU_LABEL: ContentLibraryMenuItem[] = [
    {
        id: "published",
        icon: <LocalLibraryTwoToneIcon style={{ color: "#444" }} />,
        text: <Typography variant="subtitle1" color="primary">
            <FormattedMessage id="library_publishedButton" />
        </Typography>,
    },
    {
        id: "pending",
        icon: <HourglassFullTwoToneIcon style={{ color: "#444" }} />,
        text: <Typography variant="subtitle1" color="primary">
            <FormattedMessage id="library_pendingButton" />
        </Typography>,
    },
    {
        id: "archived",
        icon: <ArchiveTwoToneIcon style={{ color: "#444" }} />,
        text: <Typography variant="subtitle1" color="primary">
            <FormattedMessage id="library_archivedButton" />
        </Typography>,
    },
];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        buttonSpacing: {
            margin: theme.spacing(0, 1),
        },
        root: {
            height: "100%",
        },
        menuText: {
            margin: "0 8px"
        },
    }),
);

const StyledMenu = withStyles({})((props: MenuProps) => (
    <Menu
        elevation={4}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
        {...props}
    />
));

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
    const [menuElement, setMenuElement] = useState<null | HTMLElement>(null);

    useEffect(() => {
        if (isLive) { toggleLive(); }
    }, [])

    const handleOnClickMenu = (id: string) => {
        setMenuElement(null);
        setActiveMenu(id); // TODO: fix
    }

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
                    <Hidden mdDown>
                        <Button
                            color="primary"
                            className={classes.buttonSpacing}
                            size="large"
                            onClick={() => setActiveMenu("published")}
                            startIcon={<LocalLibraryTwoToneIcon style={{ color: "#444" }} />}
                        >
                            <FormattedMessage id="library_publishedButton" />
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
                    </Hidden>
                    <Hidden lgUp>
                        <Button
                            color="inherit"
                            aria-owns={menuElement ? "library-menu" : undefined}
                            aria-haspopup="true"
                            onClick={(e) => setMenuElement(e.currentTarget)}
                            size="large"
                        >
                            <FormattedMessage id={`library_${activeMenu}Button`} />
                            <ExpandMoreIcon />
                        </Button>
                        <StyledMenu
                            id="library-menu"
                            className={classes.menuText}
                            anchorEl={menuElement}
                            keepMounted
                            open={Boolean(menuElement)}
                            onClose={() => setMenuElement(null)}
                        >
                            {
                                MENU_LABEL.map((menu) => (
                                    <MenuItem
                                        key={menu.id}
                                        selected={activeMenu === menu.id}
                                        onClick={() => handleOnClickMenu(menu.id)}
                                    >
                                        <ListItemIcon>
                                            {menu.icon}
                                        </ListItemIcon>
                                        {menu.text}
                                    </MenuItem>
                                ))
                            }
                        </StyledMenu>
                    </Hidden>
                </Grid>
            </Grid>
            <LibraryContent activeMenu={activeMenu} />
        </Grid>
    );
}

function LibraryContent(props: { activeMenu: string }) {
    switch (props.activeMenu) {
        case "published":
            return (
                <>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">
                            <FormattedMessage id="library_publishedTitle" />
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
                            <FormattedMessage id="library_publishedTitle" />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <LibraryContentView />
                    </Grid>
                </>
            )
    }
}
