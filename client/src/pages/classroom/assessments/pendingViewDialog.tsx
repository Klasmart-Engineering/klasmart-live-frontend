import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
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
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { TransitionProps } from "@material-ui/core/transitions";
import EditIcon from '@material-ui/icons/Edit';
import BlockIcon from '@material-ui/icons/Block';
import SaveIcon from "@material-ui/icons/Save";
import CompleteIcon from '@material-ui/icons/Done';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { State } from "../../../store/store";
import Collapse from '@material-ui/core/Collapse';
import Checkbox from "@material-ui/core/Checkbox";
import DialogAppBar from "../../../components/styled/dialogAppBar";
import StyledFAB from "../../../components/styled/fabButton";
import {
    useRestAPI,
    AssessmentResponse,
    LearningOutcomeResponse,
    UpdateAssessmentRequest,
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
        speedDial: {
            position: 'fixed',
            '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
                bottom: theme.spacing(2),
                right: theme.spacing(1.5),
            },
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
        }
    }),
);

const Motion = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Grow style={{ transformOrigin: "0 0 0" }} ref={ref} {...props} />;
});

export default function PendingViewDialog(props: Props) {
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
    const [speedDialOpen, setSpeedDialOpen] = useState(false);
    const [speedDialHidden, setSpeedDialHidden] = useState(false);
    const [checkedStudents, setCheckedStudents] = useState<{
        profileId: string,
        loId: number
    }[]>([]);

    const resetAwards = () => {
        let prepared = true;

        (async () => {
            const info = await fetchAssessmentInfo();

            if (prepared) {
                let chkStds: {
                    profileId: string,
                    loId: number
                }[] = []
                if (info.learningOutcomes !== undefined) {
                    let los = info.learningOutcomes
                    for (let i = 0; i < los.length; ++i) {
                        if (los[i].assessedStudents) {
                            los[i].assessedStudents.map((stdId) => {
                                chkStds.push({
                                    profileId: stdId,
                                    loId: los[i].loId
                                })
                            })
                        }
                    }
                    let awardedList = []
                    for (let i = 0; i < los.length; ++i) {
                        let entries = 0
                        for (let j = 0; j < chkStds.length; ++j) {
                            if (chkStds[j].loId === los[i].loId) {
                                entries++
                            }
                        }
                        if (entries === students.length) {
                            awardedList.push(los[i].loId)
                        }
                    }
                    setAwardedLOs(awardedList);
                    setCheckedStudents(chkStds);
                }
                setInfo(info);
            }
        })();

        return () => { prepared = false; };
    }

    useEffect(() => {
        return resetAwards()
    }, [open])

    const handleOnClickCancel = () => {
        setAwardMode(false);
        resetAwards();
    }
    const handleOnClickAward = () => {
        setAwardMode(true);
    }

    const students = useSelector((state: State) => state.account.students);
    const [collapseIndex, setCollapseIndex] = useState();
    const [LOs, setLOs] = useState<LearningOutcomeResponse[]>([]);
    const [awardedLOs, setAwardedLOs] = useState<number[]>([])
    useEffect(() => {
        let prepared = true;

        (async () => {
            if (!info || !info.learningOutcomes) { return; }
            let LOs = []
            const loIds = info.learningOutcomes.map(lo => lo.loId);
            for (const id of loIds) {
                const lo = await api.getLearningOutcome(id);
                LOs.push(lo);
            }
            setLOs(LOs);

            if (prepared) { setInfo(info); }
        })();

        return () => { prepared = false; };
    }, [awardMode])

    useEffect(() => {
        // NOTE: Purpose to handle CompleteFAB disabled
    }, [checkedStudents])

    const handleOnClickStudent = (loId: number, student: {
        profileId: string,
        profileName: string,
        iconLink: string
    }) => {
        const currentIndex = checkedStudents.findIndex(chkStd => chkStd.profileId === student.profileId && chkStd.loId === loId)
        const newChecked = [...checkedStudents];

        if (currentIndex === -1) {
            newChecked.push({
                loId: loId,
                profileId: student.profileId
            });
        } else {
            newChecked.splice(currentIndex, 1);
        }

        // Check if all awarded now
        let studentLOs = new Array<string>();
        newChecked.map((chk) => {
            if (chk.loId === loId) {
                studentLOs.push(chk.profileId);
            }
        })
        let newAwardedLOs = [...awardedLOs];
        if (students.length === studentLOs.length) {
            newAwardedLOs.push(loId);
        } else {
            const loIndex = newAwardedLOs.findIndex(award => award === loId);
            if (loIndex !== -1) {
                newAwardedLOs.splice(loIndex, 1);
            }
        }

        setAwardedLOs(newAwardedLOs);
        setCheckedStudents(newChecked);
    }

    function handleOnClickAwardAll(loId: number) {
        let currentIndex = awardedLOs ? awardedLOs.findIndex(awardedLO => awardedLO === loId) : -1;
        let newChecked = [...checkedStudents]
        if (currentIndex !== -1) {
            // Uncheck all students
            for (let i = 0; i < students.length; ++i) {
                for (let j = newChecked.length - 1; j >= 0; --j) {
                    if (students[i].profileId === newChecked[j].profileId && newChecked[j].loId === loId) {
                        newChecked.splice(j, 1)
                    }
                }
            }
            if (awardedLOs !== undefined) {
                awardedLOs.splice(currentIndex, 1)
            }
        } else {
            // Check all students
            for (let i = 0; i < students.length; ++i) {
                let found = false
                for (let j = 0; j < newChecked.length; ++j) {
                    if (students[i].profileId === newChecked[j].profileId && loId === newChecked[j].loId) {
                        found = true
                    }
                }
                if (!found) {
                    newChecked.push({
                        profileId: students[i].profileId,
                        loId: loId
                    })
                }
            }
            if (awardedLOs !== undefined) {
                awardedLOs.push(loId);
            }
        }
        setAwardedLOs(awardedLOs);
        setCheckedStudents(newChecked);
    }

    function getCheckState(loId: number): number {
        const currentIndex = awardedLOs ? awardedLOs.findIndex(awardedLO => awardedLO === loId) : -1;
        if (currentIndex === -1) {
            for (let i = 0; i < checkedStudents.length; ++i) {
                if (checkedStudents[i].loId === loId) {
                    return 1;
                }
            }
            return 0;
        }
        return 2;
    }

    const AWARDMODE_ACTIONS = [
        { icon: <BlockIcon style={{ margin: 0 }} />, name: 'Cancel', action: () => handleOnClickCancel() },
        { icon: <SaveIcon style={{ margin: 0 }} />, name: 'Save', action: () => handleOnClickSave() },
        { icon: <CompleteIcon style={{ margin: 0 }} />, name: 'Complete', action: () => handleOnClickComplete() },
    ]
    const handleSpeedDialClose = () => {
        setSpeedDialOpen(false);
    };
    const handleSpeedDialOpen = () => {
        setSpeedDialOpen(true);
    };

    async function handleOnClickSave() {
        if (inFlight || !info) { return; }
        try {
            setInFlight(true);
            const assInfo: UpdateAssessmentRequest = {
                state: 2,
                awardedStudents: checkedStudents
            }
            await api.updateAssessment(info.assId, assInfo);

            setAwardMode(false);
            onClose();
        } catch (e) {
            console.error(e);
            setAwardMode(false);
            onClose();
        } finally {
            setInFlight(false);
        }
    }

    async function handleOnClickComplete() {
        if (inFlight || !info) { return; }
        try {
            setInFlight(true);
            const assInfo: UpdateAssessmentRequest = {
                state: 2,
                awardedStudents: checkedStudents
            }
            let completedStudentMap: Map<string, CompleteAssessmentStudentsResquest> = new Map();
            // Save the success
            for (let j = 0; j < checkedStudents.length; ++j) {
                let cptdStd = completedStudentMap.get(checkedStudents[j].profileId)
                if (cptdStd === undefined) {
                    cptdStd = {
                        successOutcomes: [],
                        failureOutcomes: []
                    }
                }
                cptdStd.successOutcomes.push(checkedStudents[j].loId)
                completedStudentMap.set(checkedStudents[j].profileId, cptdStd)
            }
            // Save the failure
            for (let k = 0; k < LOs.length; ++k) {
                for (let i = 0; i < students.length; ++i) {
                    let found = false
                    for (let j = 0; j < checkedStudents.length; ++j) {
                        if (students[i].profileId === checkedStudents[j].profileId && checkedStudents[j].loId === LOs[k].loId) {
                            found = true
                        }
                    }
                    if (!found) {
                        let cptdStd = completedStudentMap.get(students[i].profileId)
                        if (cptdStd === undefined) {
                            cptdStd = {
                                successOutcomes: [],
                                failureOutcomes: []
                            }
                        }
                        cptdStd.failureOutcomes.push(LOs[k].loId)
                        completedStudentMap.set(students[i].profileId, cptdStd)
                    }
                }
            }

            const completeAssInfo: CompleteAssessmentRequest = {
                sessionId: "",
                students: completedStudentMap,
                date: 0,
            }
            await api.updateAssessment(info.assId, assInfo);
            await api.completeAssessment(info.assId, completeAssInfo);

            setCheckedStudents([]);
            setAwardMode(false);
            onClose();
            location.reload();
        } catch (e) {
            console.error(e);
            setAwardMode(false);
            onClose();
        } finally {
            setInFlight(false);
        }
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
                                <StyledFAB className={classes.cancelButton} size="small" onClick={handleOnClickCancel}>
                                    Cancel <BlockIcon style={{ paddingLeft: theme.spacing(1) }} />
                                </StyledFAB>
                            </Grid>
                            <Grid item style={{ marginLeft: 10 }}>
                                <StyledFAB
                                    disabled={checkedStudents.length === 0}
                                    size="small"
                                    onClick={handleOnClickSave}
                                >
                                    Save <SaveIcon style={{ paddingLeft: theme.spacing(1) }} />
                                </StyledFAB>
                            </Grid>
                            <Grid item style={{ marginLeft: 10 }}>
                                <StyledFAB
                                    disabled={checkedStudents.length === 0}
                                    size="small"
                                    onClick={handleOnClickComplete}
                                >
                                    Complete <CompleteIcon style={{ paddingLeft: theme.spacing(1) }} />
                                </StyledFAB>
                            </Grid>
                        </> :
                            (info && info.state === 1 ? null :
                                <Grid item>
                                    <StyledFAB size="small" onClick={handleOnClickAward}>
                                        Award <EditIcon style={{ paddingLeft: theme.spacing(1) }} />
                                    </StyledFAB>
                                </Grid>
                            )
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
                {awardMode && info && info.state === 2 ?
                    <Grid className={classes.menuGrid} item xs={12}>
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
                                <ListItem key={lo.loId} button onClick={(e) => { collapseIndex === index ? setCollapseIndex(-1) : setCollapseIndex(index); e.preventDefault() }}>
                                    <ListItemText primary={lo.title + (lo.assumed ? " (Assumed)" : "")} />
                                    <ListItemIcon onClick={(e) => { handleOnClickAwardAll(lo.loId); e.stopPropagation() }}>
                                        <Checkbox
                                            checked={getCheckState(lo.loId) > 0}
                                            style={getCheckState(lo.loId) === 1 ?
                                                {
                                                    color: "#f9a825"
                                                } : {
                                                    color: "#0E78D5"
                                                }}
                                        />
                                    </ListItemIcon>
                                    {collapseIndex === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    <Collapse in={collapseIndex === index} timeout="auto" unmountOnExit>
                                        {students.map((student, index) =>
                                            <ListItem key={student.profileId} button onClick={(e) => { handleOnClickStudent(lo.loId, student); e.preventDefault(); e.stopPropagation() }}>
                                                <ListItemAvatar>
                                                    <Avatar src={student.iconLink} />
                                                </ListItemAvatar>
                                                <ListItemText primary={student.profileName} />
                                                <ListItemIcon>
                                                    <Checkbox
                                                        checked={checkedStudents.findIndex(chkStd => chkStd.profileId === student.profileId && chkStd.loId === lo.loId) !== -1}
                                                        color="primary"
                                                    />
                                                </ListItemIcon>
                                            </ListItem>
                                        )}
                                    </Collapse>
                                </ListItem>
                            )}
                        </List>
                    </Grid > :
                    (info ? <AssessmentDetails ass={info} /> : "Loading...")
                }
            </Grid>
            <Hidden mdUp>
                {awardMode ?
                    <SpeedDial
                        ariaLabel="SpeedDial-edit"
                        className={classes.speedDial}
                        hidden={speedDialHidden}
                        icon={<MoreVertIcon />}
                        onClose={handleSpeedDialClose}
                        onOpen={handleSpeedDialOpen}
                        open={speedDialOpen}
                        direction="up"
                        FabProps={{ size: "small" }}
                    >
                        {AWARDMODE_ACTIONS.map((action) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                onClick={action.action}
                            />
                        ))}
                    </SpeedDial> :
                    (info && info.state === 1 ? null :
                        <StyledFAB className={classes.fab} size="small" onClick={handleOnClickAward}>
                            <EditIcon />
                        </StyledFAB>
                    )
                }
            </Hidden>
        </Dialog>
    );
}

interface AssessmentDetailsProps {
    ass: AssessmentResponse
}

function msToMinutes(duration: number): number {
    var seconds = duration / 1000 / 1000 / 1000 % 3600;
    var minutes = seconds / 60;
    return Math.floor(minutes);
}

function AssessmentDetails(props: AssessmentDetailsProps) {
    const { ass } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            {ass.state === 1 ?
                <Grid className={classes.menuGrid} item xs={12}>
                    <Typography variant="subtitle2" color="primary">
                        Assessment can be awarded after class
                    </Typography>
                </Grid>
                : null
            }
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
                <Typography variant="subtitle1">{ass.duration > 0 ? msToMinutes(ass.duration) + " minutes" : "-"}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={12}>
                <Typography variant="caption" color="textSecondary">Students</Typography>
                <Typography variant="subtitle1">
                    {ass.students.length === 0 ? "-" : ass.students.map(student => student.profileName).join(", ")}
                </Typography>
            </Grid>
        </>
    )
}
