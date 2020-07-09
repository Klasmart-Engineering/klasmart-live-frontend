import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import LearningOutcomeIcon from "@material-ui/icons/EmojiObjectsTwoTone";
import PendingIcon from "@material-ui/icons/HourglassFullTwoTone";
import CompleteIcon from "@material-ui/icons/AssignmentTurnedInTwoTone";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";

import { State } from "../../../store/store";
import { ActionTypes } from "../../../store/actions";
import CreateLearningOutcomeDialog from "./learningOutcomeCreateDialog";
import AssessmentsLibraryView from "./learningOutcomeLibraryView";
import AssessmentsPendingView from "./pendingView";
import AssessmentsCompletedView from "./completedView";
import { useRestAPI, LearningOutcomeResponse, AssessmentResponse } from "../../../api/restapi";
import { AssessmentsMenu } from "../../../types/objectTypes";

type AssessmentsMenuItem = {
    id: AssessmentsMenu;
    icon: JSX.Element;
    text: JSX.Element;
}

const MENU_LABEL: AssessmentsMenuItem[] = [
    {
        id: "library",
        icon: <LearningOutcomeIcon style={{ color: "#444" }} />,
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

const useStyles = makeStyles(() =>
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
    const api = useRestAPI();
    async function fetchLearningOutcomes() {
        const payload = await api.getLearningOutcomes();
        return payload.learningOutcomes
            .sort((a, b) => b.updatedDate - a.updatedDate);
    }
    async function fetchAssessments() {
        const payload = await api.getAssessments();
        return payload.assessments
            .sort((a, b) => b.updatedDate - a.updatedDate);
    }

    const classes = useStyles();
    const store = useStore();

    const isLive = useSelector((state: State) => state.ui.liveClass);
    const toggleLive = () => {
        store.dispatch({ type: ActionTypes.LIVE_CLASS_TOGGLE, payload: false });
    };
    const activeMenu = useSelector((state: State) => state.ui.activeAssessmentsMenu);
    const setActiveMenu = (value: string) => {
        store.dispatch({ type: ActionTypes.ACTIVE_ASSESSMENTS_MENU, payload: value });
    };
    const [loading, setLoading] = useState(false);
    const [menuElement, setMenuElement] = useState<null | HTMLElement>(null);
    const [los, setLos] = useState<LearningOutcomeResponse[]>([]);
    const [assessments, setAssessments] = useState<AssessmentResponse[]>([]);

    useEffect(() => {
        if (isLive) { toggleLive(); }
        let prepared = true;

        (async () => {
            setLoading(true);
            const los = await fetchLearningOutcomes();
            const assessments = await fetchAssessments();
            if (prepared) {
                setLos(los);
                setAssessments(assessments);
                setLoading(false);
            }
        })();

        return () => { prepared = false; };
    }, []);

    const handleOnClickMenu = (id: string) => {
        setMenuElement(null);
        setActiveMenu(id);
    };

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            className={classes.root}
            spacing={4}
        >
            <Grid container justify="space-between" item xs={12}>
                <Grid item xs={6}>
                    {activeMenu === "library" ? <CreateLearningOutcomeDialog /> : null}
                </Grid>
                <Grid container justify="flex-end" item xs={6}>
                    <Hidden mdDown>
                        <Button
                            className={classes.menuText}
                            size="large"
                            color="primary"
                            onClick={() => setActiveMenu("library")}
                            startIcon={<LearningOutcomeIcon style={{ color: "#444" }} />}
                        >
                            <FormattedMessage id="assess_libraryButton" />
                        </Button>
                        <Button
                            className={classes.menuText}
                            size="large"
                            color="primary"
                            onClick={() => setActiveMenu("pending")}
                            startIcon={<PendingIcon style={{ color: "#444" }} />}
                        >
                            <FormattedMessage id="assess_pendingButton" />
                        </Button>
                        <Button
                            className={classes.menuText}
                            size="large"
                            color="primary"
                            onClick={() => setActiveMenu("completed")}
                            startIcon={<CompleteIcon style={{ color: "#444" }} />}
                        >
                            <FormattedMessage id="assess_completedButton" />
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
            {loading ? 
                <Grid item xs={12} style={{ textAlign: "center" }}>
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
                </Grid> :
                <AssessmentsContent
                    activeMenu={activeMenu}
                    los={los}
                    assessments={assessments}
                />
            }
        </Grid >
    );
}

interface Props {
    activeMenu: AssessmentsMenu;
    los: LearningOutcomeResponse[];
    assessments: AssessmentResponse[];
}
function AssessmentsContent(props: Props) {
    const { activeMenu, los, assessments } = props;
    switch (activeMenu) {
    case "library":
        return (
            <>
                <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        <FormattedMessage id="assess_libraryTitle" />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <AssessmentsLibraryView data={los} />
                    </Grid>
                </Grid>
            </>
        );

    case "pending":
        return (
            <>
                <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        <FormattedMessage id="assess_pendingTitle" />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <AssessmentsPendingView data={assessments} />
                    </Grid>
                </Grid>
            </>
        );

    case "completed":
        return (
            <>
                <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary">
                        <FormattedMessage id="assess_completedTitle" />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <AssessmentsCompletedView data={assessments} />
                    </Grid>
                </Grid>
            </>
        );

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
                        <AssessmentsLibraryView data={los} />
                    </Grid>
                </Grid>
            </>
        );
    }
}
