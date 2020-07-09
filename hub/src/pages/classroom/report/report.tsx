import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import * as React from "react";
import { useEffect, useState } from "react";
import { useStore, useSelector } from "react-redux";
import { State } from "../../../store/store";
import { ActionTypes } from "../../../store/actions";
import { useRestAPI, ReportLearningOutcomeRequest } from "./api/restapi";
import { FormattedMessage } from "react-intl";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts";
import { getDefaultProgId } from "../../../config";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles(() =>
    createStyles({
        menuBtn: {
            margin: "0 8px"
        },
        root: {
            height: "100%",
        },
    }),
);

export default function ReportLayout() {
    const classes = useStyles();
    const store = useStore();

    const [inFlight, setInFlight] = useState(false);
    const isLive = useSelector((state: State) => state.ui.liveClass);
    const toggleLive = () => {
        store.dispatch({ type: ActionTypes.LIVE_CLASS_TOGGLE, payload: false });
    };
    useEffect(() => {
        if (isLive) { toggleLive(); }
    }, []);

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
            {renderChart()}
        </Grid >
    );
}

function renderChart() {
    const restApi = useRestAPI();
    const [report, setReport] = useState<any | undefined>(undefined);
    const [reportError, setReportError] = useState<JSX.Element | undefined>(undefined);
    const [reportInFlight, setReportInFlight] = useState(false);
    const [studentInFlight, setStudentInFlight] = useState(false);
    const [studentError, setStudentError] = useState<JSX.Element | undefined>(undefined);
    const [students, setStudents] = useState<any[]>();
    const [selectedStudent, setSelectedStudent] = useState<any>();

    useEffect(() => {
        let prepared = true;

        (async () => {
            let info = await getStudents();
            if (info) {
                info = info.filter((student) => student.profileName !== "Woody" && student.profileName !== "Buzz Lightyear" && student.profileName !== "Rex" && student.profileName !== "Slinky Dog");
            }

            if (prepared) { setStudents(info); }
        })();

        return () => { prepared = false; };
    }, []);

    async function getStudents() {
        if (studentInFlight) { return; }
        try {
            setStudentInFlight(true);
            const assessmentsResponse = await restApi.getAssessments();
            const studentMap = new Map<string, any>();
            for (let i = 0; i < assessmentsResponse.assessments.length; ++i) {
                for (let j = 0; j < assessmentsResponse.assessments[i].students.length; ++j) {
                    studentMap.set(assessmentsResponse.assessments[i].students[j].profileId, assessmentsResponse.assessments[i].students[j]);
                }
            }
            const studentList = [];
            for (const [key, value] of studentMap) {
                studentList.push(value);
            }
            return studentList;
        } catch (e) {
            console.error(e);
            setStudentError(<FormattedMessage id="ERROR_UNKOWN" />);
        } finally {
            setStudentInFlight(false);
        }
    }

    async function getReport(student: any) {
        if (reportInFlight) { return; }
        try {
            setReportInFlight(true);
            const reportInfo: ReportLearningOutcomeRequest = {
                profileId: student.profileId,
                programId: getDefaultProgId(),
                classId: ""
            };
            let responseReport: any = {};
            responseReport = await restApi.getReportLearningOutcomeList(reportInfo);
            // console.log("report: ", responseReport);
            // TODO: Use get by ID list
            // let loIDs: number[] = [];
            // responseReport.learningOutcomes.map((lo) => {loIDs.push(lo.id)});
            const loInfoListResponse = await restApi.getLearningOutcomes();
            // console.log("loInfoListResponse", loInfoListResponse);
            // TODO: Use get by ID list
            const devSkillInfoListResponse = await restApi.getDevSkills();
            // console.log("devSkillInfoListResponse", devSkillInfoListResponse);

            const devSkillMap: Map<string, any> = new Map<string, any>();
            for (let j = 0; j < devSkillInfoListResponse.devSkills.length; ++j) {
                const loSkillList: number[] = [];
                for (let i = 0; i < loInfoListResponse.learningOutcomes.length; ++i) {
                    if (devSkillInfoListResponse.devSkills[j].devSkillId === loInfoListResponse.learningOutcomes[i].devSkillId) {
                        loSkillList.push(loInfoListResponse.learningOutcomes[i].loId);
                    }
                }
                devSkillMap.set(devSkillInfoListResponse.devSkills[j].devSkillId, {
                    name: devSkillInfoListResponse.devSkills[j].name,
                    loList: loSkillList,
                });
            }

            const report: any[] = [];
            // console.log("devSkillMap: ", devSkillMap)
            for (const key of devSkillMap.keys()) {
                let successNb = 0;
                let failureNb = 0;
                const loList = devSkillMap.get(key).loList;
                for (let i = 0; i < loList.length; ++i) {
                    for (let j = 0; j < responseReport.learningOutcomes.length; ++j) {
                        if (loList[i] === responseReport.learningOutcomes[j].id) {
                            if (responseReport.learningOutcomes[j].status === 3) {
                                successNb++;
                            } else if (responseReport.learningOutcomes[j].status === 4) {
                                failureNb++;
                            }
                        }
                    }
                }
                let successRate = 0.0;
                let failureRate = 0.0;
                if (successNb > 0) {
                    successRate = successNb / (successNb + failureNb) * 100.0;
                }
                if (failureNb > 0) {
                    failureRate = failureNb / (successNb + failureNb) * 100.0;
                }
                report.push({ name: devSkillMap.get(key).name, Achieved: successRate, NotAchieved: failureRate });
            }
            // console.log("report: ", report)
            setReport(report);
            setSelectedStudent(student);
        } catch (e) {
            console.error(e);
            setReportError(<FormattedMessage id="ERROR_UNKOWN" />);
        } finally {
            setReportInFlight(false);
        }
    }

    return (
        <Grid container item>
            <Grid item xs={12}>
                {students ? students.map((student, index) =>
                    <ListItem key={student.profileId} button onClick={() => getReport(student)}>
                        <ListItemText primary={student.profileName} />
                    </ListItem>
                ) : null}
            </Grid>
            <Grid item xs={12}>
                <Grid item xs={12}>
                    {selectedStudent !== undefined ? <h2>{selectedStudent.profileName}</h2> : null}
                </Grid>
                <Grid item xs={12}>
                    {report !== undefined ?
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={report}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Achieved" fill="#aed581" />
                                <Bar dataKey="NotAchieved" fill="#ef9a9a" />
                            </BarChart>
                        </ResponsiveContainer>
                        : null}
                </Grid>
            </Grid>
        </Grid>
    );
}
