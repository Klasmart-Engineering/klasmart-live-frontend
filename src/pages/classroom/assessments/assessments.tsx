import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import LibraryIcon from '@material-ui/icons/LocalLibraryTwoTone';
import PendingIcon from '@material-ui/icons/HourglassFullTwoTone';
import CompleteIcon from '@material-ui/icons/AssignmentTurnedInTwoTone';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import CreateLearningOutcomeDialog from "./learningOutcomeCreateDialog";
import AssessmentsLibraryView from "./learningOutcomeLibraryView";
import AssessmentsPendingView from "./pendingView";
import AssessmentsCompletedView from "./completedView";

type AssessmentsMenuItem = {
    id: string;
    icon: JSX.Element;
    text: JSX.Element;
}

const MENU_LABEL: AssessmentsMenuItem[] = [
    {
        id: "library",
        icon: <LibraryIcon style={{ color: "#444" }} />,
        text: <Typography variant="subtitle1" color="primary">
            <FormattedMessage id="assess_libraryButton" />
        </Typography>,
    },
    {
        id: "pending",
        icon: <PendingIcon style={{ color: "#444" }} />,
        text: <Typography variant="subtitle1" color="primary">
            <FormattedMessage id="assess_pendingButton" />
        </Typography>,
    },
    {
        id: "completed",
        icon: <CompleteIcon style={{ color: "#444" }} />,
        text: <Typography variant="subtitle1" color="primary">
            <FormattedMessage id="assess_completedButton" />
        </Typography>,
    },
];

enum AssessmentsMenu {
    LIBRARY = "library",
    PENDING = "pending",
    COMPLETED = "completed"
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuText: {
            margin: "0 8px"
        },
        root: {
            height: "100%",
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

export default function AssessmentsLayout() {
    const classes = useStyles();

    const [activeMenu, setActiveMenu] = useState<AssessmentsMenu>(AssessmentsMenu.PENDING);
    const [inFlight, setInFlight] = useState(false);
    const [menuElement, setMenuElement] = useState<null | HTMLElement>(null);


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
            <Grid item xs={12} style={{ display: inFlight ? "unset" : "none", textAlign: "center" }}>
                <Grid
                    container item
                    direction="row"
                    alignItems="center"
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <CircularProgress />
                    </Grid>
                    <Grid item xs={12}>
                        Give us a sec while we get things ready!
                    </Grid>
                </Grid>
            </Grid>
            <Grid container justify="space-between" item xs={12}>
                <Grid item xs={6}>
                    {activeMenu === AssessmentsMenu.LIBRARY ? <CreateLearningOutcomeDialog /> : null}
                </Grid>
                <Grid container justify="flex-end" item xs={6}>
                    <Hidden mdDown>
                        <Button
                            className={classes.menuText}
                            size="large"
                            color="primary"
                            onClick={() => setActiveMenu(AssessmentsMenu.LIBRARY)}
                            startIcon={<LibraryIcon style={{ color: "#444" }} />}
                        >
                            <FormattedMessage id="assess_libraryButton" />
                        </Button>
                        <Button
                            className={classes.menuText}
                            size="large"
                            color="primary"
                            onClick={() => setActiveMenu(AssessmentsMenu.PENDING)}
                            startIcon={<PendingIcon style={{ color: "#444" }} />}
                        >
                            <FormattedMessage id="assess_pendingButton" />
                        </Button>
                        <Button
                            className={classes.menuText}
                            size="large"
                            color="primary"
                            onClick={() => setActiveMenu(AssessmentsMenu.COMPLETED)}
                            startIcon={<CompleteIcon style={{ color: "#444" }} />}
                        >
                            <FormattedMessage id={`assess_completedButton`} />
                        </Button>
                    </Hidden>
                    <Hidden lgUp>
                        <Button
                            color="inherit"
                            aria-owns={menuElement ? "assessments-menu" : undefined}
                            aria-haspopup="true"
                            onClick={(e) => setMenuElement(e.currentTarget)}
                            size="large"
                        >
                            <FormattedMessage id={`assess_${activeMenu}Button`} />
                            <ExpandMoreIcon />
                        </Button>
                        <StyledMenu
                            id="assessments-menu"
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
            <AssessmentsContent activeMenu={activeMenu} />
        </Grid >
    );
}

function AssessmentsContent(props: { activeMenu: AssessmentsMenu }) {
    switch (props.activeMenu) {
        case AssessmentsMenu.LIBRARY:
            return (
                <>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">
                            <FormattedMessage id="assess_libraryTitle" />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <AssessmentsLibraryView />
                        </Grid>
                    </Grid>
                </>
            )

        case AssessmentsMenu.PENDING:
            return (
                <>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">
                            <FormattedMessage id="assess_pendingTitle" />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <AssessmentsPendingView />
                        </Grid>
                    </Grid>
                </>
            )

        case AssessmentsMenu.COMPLETED:
            return (
                <>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">
                            <FormattedMessage id="assess_completedTitle" />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <AssessmentsCompletedView />
                        </Grid>
                    </Grid>
                </>
            )

        default:
            return (
                <>
                    <Grid item xs={12}>
                        <Typography variant="caption" color="textSecondary">
                            <FormattedMessage id="assess_libraryTitle" />
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <AssessmentsLibraryView />
                        </Grid>
                    </Grid>
                </>
            )
    }
}
