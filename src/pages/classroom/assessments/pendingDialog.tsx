import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import Avatar from '@material-ui/core/Avatar';
import List from "@material-ui/core/List";
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { TransitionProps } from "@material-ui/core/transitions";
import ChildIcon from '@material-ui/icons/ChildCare';
import BlockIcon from '@material-ui/icons/Block';
import CompleteIcon from '@material-ui/icons/Done';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Collapse from '@material-ui/core/Collapse';
import Checkbox from "@material-ui/core/Checkbox";
import { State } from "../../../store/store";
import DialogAppBar from "../../../components/styled/dialogAppBar";
import StyledFAB from "../../../components/styled/fabButton";
import {
    useRestAPI,
    AssessmentResponse,
    LearningOutcomeResponse,
    UpdateAssessmentRequest,
    UpdateLessonPlanRequest,
    CompleteAssessmentRequest,
    CompleteAssessmentStudentsResquest
} from "./api/restapi";

interface Props {
    assId: string
    open: boolean
    onClose: any
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: "relative",
        },
        cancelButton: {
            backgroundColor: "#ff6961",
            color: "white",
        },
        fab: {
            bottom: theme.spacing(2),
            position: "fixed",
            right: theme.spacing(2),
        },
        leftFab: {
            backgroundColor: "#ff6961",
            color: "white",
            bottom: theme.spacing(2),
            position: "fixed",
            left: theme.spacing(2),
        },
        menuContainer: {
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(2, 2),
            },
        },
        menuGrid: {
            padding: theme.spacing(1)
        },
        title: {
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(1),
        },
        errorIcon: {
            fontSize: "1em",
            marginRight: theme.spacing(1),
        },
    }),
);

const Motion = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Grow style={{ transformOrigin: "0 0 0" }} ref={ref} {...props} />;
});

export default function CompletedViewDialog(props: Props) {
    const { assId, open, onClose } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const api = useRestAPI();

    async function fetchAssessmentInfo() {
        const payload = await api.getAssessment(assId);
        return payload;
    }

    const [info, setInfo] = useState<AssessmentResponse>();
    const [awardMode, setAwardMode] = useState(false);
    const [inFlight, setInFlight] = useState(false);

    useEffect(() => {
        let prepared = true;

        (async () => {
            const info = await fetchAssessmentInfo();

            if (prepared) { setInfo(info); }
        })();

        return () => { prepared = false; };
    }, [open])

    const handleOnClickBack = () => {
        setAwardMode(false);
    }
    const handleOnClickAward = () => {
        setAwardMode(true);
    }
    async function handleOnClickComplete() {
        if (inFlight || !info) { return; }
        try {
            setInFlight(true);

            const assInfo: UpdateAssessmentRequest = {
                students: checkedStudents
            }
            await api.updateAssessment(info.assId, assInfo);

            // TODO: Need to Add CompleteAssessment
            // const lpInfo: UpdateLessonPlanRequest = {
            //     learningOutcomes: checkedLOs
            // }
            // await api.updateLessonPlan(info.lessonPlanId, lpInfo);

            setCheckedStudents([]);
            setCheckedLOs([]);
            location.reload();
        } catch (e) {
            console.error(e);
            onClose();
        } finally {
            setInFlight(false);
        }
    }
    // When awardMode === true
    async function fetchLOs() {
        const payload = await api.getLearningOutcomes();
        return payload.learningOutcomes
            .sort((a, b) => b.createdDate - a.createdDate)
            .filter(lo => lo.published);
    }

    const students = useSelector((state: State) => state.account.students);
    const [collapse, setCollapse] = useState(true);
    const [LOs, setLOs] = useState<LearningOutcomeResponse[]>([]);
    const [checkedStudents, setCheckedStudents] = useState<{
        profileId: string,
        profileName: string,
        iconLink: string
    }[]>([]);
    const [checkedLOs, setCheckedLOs] = useState<number[]>([]);

    useEffect(() => {
        let prepared = true;

        (async () => {
            const los = await fetchLOs();
            if (prepared) { setLOs(los); }
        })();

        return () => { prepared = false; };
    }, [LOs])

    useEffect(() => {
        // NOTE: Purpose to handle CompleteFAB disabled
    }, [checkedStudents, checkedLOs])

    const handleOnClickStudent = (student: {
        profileId: string,
        profileName: string,
        iconLink: string
    }) => {
        const currentIndex = checkedStudents.indexOf(student);
        const newChecked = [...checkedStudents];

        if (currentIndex === -1) {
            newChecked.push(student);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setCheckedStudents(newChecked);
    }

    const handleOnClickLO = (loId: number) => {
        const currentIndex = checkedLOs.indexOf(loId);
        const newChecked = [...checkedLOs];

        if (currentIndex === -1) {
            newChecked.push(loId);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setCheckedLOs(newChecked);
    }

    return (
        <Dialog
            aria-labelledby="nav-menu-title"
            aria-describedby="nav-menu-description"
            fullScreen
            open={open}
            onClose={onClose}
            TransitionComponent={Motion}
        >
            <DialogAppBar
                toolbarBtn={
                    <Hidden smDown>
                        {awardMode ? <>
                            <Grid item>
                                <StyledFAB className={classes.cancelButton} size="small" onClick={handleOnClickBack}>
                                    Cancel <BlockIcon style={{ paddingLeft: theme.spacing(1) }} />
                                </StyledFAB>
                            </Grid>
                            <Grid item style={{ marginLeft: 10 }}>
                                <StyledFAB
                                    disabled={checkedStudents.length === 0 || checkedLOs.length === 0}
                                    size="small"
                                    onClick={handleOnClickComplete}
                                >
                                    Complete <CompleteIcon style={{ paddingLeft: theme.spacing(1) }} />
                                </StyledFAB>
                            </Grid>
                        </> :
                            <Grid item>
                                <StyledFAB size="small" onClick={handleOnClickAward}>
                                    Award <ChildIcon style={{ paddingLeft: theme.spacing(1) }} />
                                </StyledFAB>
                            </Grid>
                        }
                    </Hidden>
                }
                handleClose={onClose}
                subtitleID={"assess_pendingViewDialogTitle"}
            />
            <Grid
                container
                direction="row"
                justify="space-around"
                alignItems="stretch"
                className={classes.menuContainer}
            >
                {awardMode ?
                    <Grid className={classes.menuGrid} item xs={12}>
                        <List component="nav" disablePadding>
                            <ListItem button onClick={() => setCollapse(!collapse)}>
                                <ListItemText secondary="Students" />
                                {collapse ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </ListItem>
                            <Collapse in={collapse} timeout="auto" unmountOnExit>
                                {students.map((student, index) =>
                                    <ListItem key={student.profileId} button onClick={() => handleOnClickStudent(student)}>
                                        <ListItemAvatar>
                                            <Avatar src={student.iconLink} />
                                        </ListItemAvatar>
                                        <ListItemText primary={student.profileName} />
                                        <ListItemSecondaryAction>
                                            <Checkbox
                                                checked={checkedStudents.indexOf(student) !== -1}
                                                color="primary"
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )}
                            </Collapse>
                        </List>
                        <List
                            component="nav"
                            disablePadding
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    Learning Outcomes
                    </ListSubheader>
                            }
                        >
                            {LOs.map((lo, index) =>
                                <ListItem key={lo.loId} button onClick={() => handleOnClickLO(lo.loId)}>
                                    <ListItemText primary={lo.title + (lo.assumed ? " (Assumed)" : "")} />
                                    <ListItemIcon>
                                        <Checkbox
                                            checked={checkedLOs.indexOf(lo.loId) !== -1}
                                            color="primary"
                                        />
                                    </ListItemIcon>
                                </ListItem>
                            )}
                        </List>
                    </Grid > :
                    (info ? <AssessmentDetails ass={info} /> : "Loading...")
                }
            </Grid>
            <Hidden mdUp>
                {awardMode ? <>
                    <StyledFAB className={classes.leftFab} size="small" onClick={handleOnClickBack}>
                        <BlockIcon />
                    </StyledFAB>
                    <StyledFAB
                        disabled={checkedStudents.length === 0 || checkedLOs.length === 0}
                        className={classes.fab}
                        size="small"
                        onClick={handleOnClickComplete}
                    >
                        <CompleteIcon />
                    </StyledFAB>
                </> :
                    <StyledFAB className={classes.fab} size="small" onClick={handleOnClickAward}>
                        <ChildIcon />
                    </StyledFAB>
                }
            </Hidden>
        </Dialog>
    );
}

interface AssessmentDetailsProps {
    ass: AssessmentResponse
}

function AssessmentDetails(props: AssessmentDetailsProps) {
    const { ass } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <Grid className={classes.menuGrid} item xs={12}>
                <Typography variant="caption" color="textSecondary">Title</Typography>
                <Typography variant="h6">{ass.name}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                <Typography variant="caption" color="textSecondary">Created on</Typography>
                <Typography variant="subtitle1">{new Date(ass.createdDate).toLocaleString()}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                <Typography variant="caption" color="textSecondary">Assessed on</Typography>
                <Typography variant="subtitle1">{new Date(ass.assessedDate).toLocaleString()}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                <Typography variant="caption" color="textSecondary">Subject</Typography>
                <Typography variant="subtitle1">{ass.subject}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                <Typography variant="caption" color="textSecondary">Duration</Typography>
                <Typography variant="subtitle1">{ass.duration}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={12}>
                <Typography variant="caption" color="textSecondary">Awarded Students</Typography>
                <Typography variant="subtitle1">
                    {ass.students.length === 0 ? "-" : ass.students.join(", ")}
                </Typography>
            </Grid>
        </>
    )
}
