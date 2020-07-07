import Grid from "@material-ui/core/Grid";
import { createStyles, makeStyles, Theme, useTheme, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import FaceIcon from "@material-ui/icons/Face";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";

import LiveBackground from "../../../assets/img/live_bg.svg";
import StyledFAB from "../../../components/styled/fabButton";
import CenterAlignChildren from "../../../components/centerAlignChildren";
import { ActionTypes } from "../../../store/actions";
import { State } from "../../../store/store";
import { LiveSessionData } from "../../../types/objectTypes";
import { useRestAPI, LessonPlanResponse } from "../../classroom/assessments/api/restapi";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        classInfoContainer: {
            background: `url(${LiveBackground}) no-repeat`,
            backgroundColor: "#f0e6cf",
            backgroundPosition: "center right",
            backgroundSize: "30%",
            borderRadius: 12,
            color: "#193d6f",
            height: "100%",
            minHeight: 360,
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                backgroundPosition: "bottom right",
                height: `min(${window.innerHeight - 20}px,56vw)`,
                padding: theme.spacing(2, 2),
            },
            [theme.breakpoints.down("xs")]: {
                height: `min(${window.innerHeight - 20}px,72vw)`,
            },
        },
        liveButton: {
            backgroundColor: "#ff6961",
            color: "white",
            marginRight: theme.spacing(2),
        },
        liveTextWrapper: {
            backgroundColor: "#ff6961",
            borderRadius: 20,
            color: "white",
            fontSize: "0.6em",
            padding: theme.spacing(0.25, 0.75),
        },
        select: {
            display: "block",
        },
    }),
);

export default function LiveCard() {
    const classes = useStyles();
    const theme = useTheme();
    const store = useStore();

    const liveData = useSelector((state: State) => state.account.finishLiveData);
    const setLiveData = (value: LiveSessionData) => {
        store.dispatch({ type: ActionTypes.FINISH_LIVE_DATA, payload: value });
    };
    const toggleLive = () => {
        const data = initLiveData();
        setLiveData(data);
        store.dispatch({ type: ActionTypes.LIVE_CLASS_TOGGLE, payload: true });
    };

    function initLiveData() {
        const startDate = new Date().getTime();
        const data: LiveSessionData = {
            classId: liveData.classId,
            className: liveData.className,
            startDate,
            students: liveData.students
        }
        return data
    }

    return (
        <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="flex-start"
            wrap="nowrap"
            className={classes.classInfoContainer}
        >
            <Grid item>
                <Grid container item spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4">Welcome to Calm Island</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <CenterAlignChildren>
                            <Typography variant="h6" style={{ paddingRight: theme.spacing(2) }}>
                                <FormattedMessage id={"live_classNameLabel"} />:
                            </Typography>
                            <ClassSelect />
                        </CenterAlignChildren>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">
                            KidsLoop <span className={classes.liveTextWrapper}>LIVE</span>
                            &nbsp;
                            <FormattedMessage id={"live_liveLinkLabel"} />:
                        </Typography>
                        <Typography variant="body1">https://zoo.kidsloop.net/live/</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <CenterAlignChildren>
                            <Typography variant="h6" style={{ paddingRight: theme.spacing(2) }}>
                                <FormattedMessage id={"live_lessonPlanLabel"} />:
                            </Typography>
                            <LessonPlanSelect />
                        </CenterAlignChildren>

                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <CenterAlignChildren>
                    <StyledFAB
                        extendedOnly
                        flat
                        className={classes.liveButton}
                        onClick={() => toggleLive()}>
                        <FormattedMessage id="live_liveButton" />
                    </StyledFAB>
                    <CenterAlignChildren>
                        <FaceIcon color="inherit" style={{ marginRight: theme.spacing(1) }} />
                        {Math.floor(Math.random() * Math.floor(5))}
                    </CenterAlignChildren>
                </CenterAlignChildren>
            </Grid>
        </Grid>
    );
}

interface ClassInfo {
    classId: string;
    className: string;
}

const CLASS_LIST: ClassInfo[] = [
    {
        classId: "CalmIsland",
        className: "Pre-production",
    },
];

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

function ClassSelect() {
    const classes = useStyles();
    const store = useStore();

    const liveData = useSelector((state: State) => state.account.finishLiveData);
    const classInfo = CLASS_LIST.find((element) => element.classId === liveData.classId);
    const [className, setClassName] = useState<string>(classInfo ? classInfo.className : "");
    const [classNameMenuElement, setClassNameMenuElement] = useState<null | HTMLElement>(null);

    function classSelect(classInfo: ClassInfo) {
        const value = {
            classId: classInfo.classId,
            className: classInfo.className,
            startDate: liveData.students,
            students: liveData.students
        };
        store.dispatch({ type: ActionTypes.FINISH_LIVE_DATA, payload: value });
        setClassName(classInfo.className);
        setClassNameMenuElement(null);
    }

    return (
        <>
            <Tooltip title={<FormattedMessage id="live_classSelect" />} enterDelay={300}>
                <Button
                    color="inherit"
                    aria-owns={classNameMenuElement ? "classSelect-menu" : undefined}
                    aria-haspopup="true"
                    data-ga-event-category="AppBar"
                    data-ga-event-action="classSelect"
                    onClick={(e) => setClassNameMenuElement(e.currentTarget)}
                >
                    <span className={classes.select}>
                        {liveData.classId === "" ?
                            <FormattedMessage id="live_classSelect" /> :
                            className
                        }
                    </span>
                    <ExpandMoreIcon fontSize="small" />
                </Button>
            </Tooltip>
            <StyledMenu
                id="classSelect-menu"
                anchorEl={classNameMenuElement}
                keepMounted
                open={Boolean(classNameMenuElement)}
                onClose={() => setClassNameMenuElement(null)}
            >
                {
                    CLASS_LIST.map((classInfo) => (
                        <MenuItem
                            key={classInfo.classId}
                            selected={liveData.classId === classInfo.classId}
                            onClick={() => classSelect(classInfo)}
                        >
                            {classInfo.className}
                        </MenuItem>
                    ))
                }
            </StyledMenu>
        </>
    );
}

function LessonPlanSelect() {
    const api = useRestAPI();
    async function fetchPublishedLessonPlans() {
        const payload = await api.getLessonPlans();
        return payload.lessonPlans
            .filter(p => p.published)
            .sort((a, b) => b.updatedDate - a.updatedDate);
    }

    const classes = useStyles();
    const store = useStore();

    const selectedLessonPlan = useSelector((state: State) => state.account.selectedLessonPlan);
    const setSelectedLessonPlan = (value: LessonPlanResponse) => {
        store.dispatch({ type: ActionTypes.SELECTED_LESSON_PLAN, payload: value });
    };
    const [lessonPlanOptions, setLessonPlanOptions] = useState<LessonPlanResponse[]>([]);
    const [lessonPlanText, setLessonPlanText] = useState<string>("");
    const [lessonPlanMenuElement, setLessonPlanMenuElement] = useState<null | HTMLElement>(null);

    useEffect(() => {
        let prepared = true;
        (async () => {
            const plans = await fetchPublishedLessonPlans();
            if (prepared) {
                setLessonPlanOptions(plans);
            }
        })();
        return () => { prepared = false; };
    }, []);

    function lessonPlanSelect(plan: LessonPlanResponse) {
        setSelectedLessonPlan(plan);
        setLessonPlanText(plan.name);
    }

    return (
        <>
            <Tooltip title={<FormattedMessage id="live_lessonPlanSelect" />} enterDelay={300}>
                <Button
                    color="inherit"
                    aria-owns={lessonPlanMenuElement ? "lesson-plan-select-menu" : undefined}
                    aria-haspopup="true"
                    data-ga-event-category="AppBar"
                    data-ga-event-action="lesson-plan-select"
                    onClick={(e) => setLessonPlanMenuElement(e.currentTarget)}
                >
                    <span className={classes.select}>
                        {lessonPlanText === ""
                            ? <FormattedMessage id="live_lessonPlanSelect" />
                            : lessonPlanText
                        }
                    </span>
                    <ExpandMoreIcon fontSize="small" />
                </Button>
            </Tooltip>
            <StyledMenu
                id="lesson-plan-select-menu"
                anchorEl={lessonPlanMenuElement}
                keepMounted
                open={Boolean(lessonPlanMenuElement)}
                onClose={() => setLessonPlanMenuElement(null)}
            >
                {
                    lessonPlanOptions.map(plan => (
                        <MenuItem
                            key={plan.lessonPlanId}
                            selected={selectedLessonPlan === plan}
                            onClick={() => lessonPlanSelect(plan)}
                        >
                            {plan.name}
                        </MenuItem>
                    ))
                }
            </StyledMenu>
        </>
    );
}