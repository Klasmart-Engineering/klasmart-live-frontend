import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import LibraryIcon from '@material-ui/icons/LocalLibraryTwoTone';
import PendingIcon from '@material-ui/icons/HourglassFullTwoTone';
import CompleteIcon from '@material-ui/icons/AssignmentTurnedInTwoTone';
import * as React from "react";
import { useEffect, useState } from "react";

import BadanamuButton from "./../../../components/styled/button";
import BadanamuTextField from "../../../components/styled/textfield";
import { useRestAPI, ReportLearningOutcomeRequest } from "./api/restapi";
import { FormattedMessage } from "react-intl";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { config } from "react-transition-group";
import { getDefaultProgId } from "../../../config"

const useStyles = makeStyles((theme: Theme) =>
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
    const [activeMenu, setActiveMenu] = useState("");
    const [inFlight, setInFlight] = useState(false);

    useEffect(() => {

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
    const [profileId, setProfileId] = useState<string>("");
    const [classId, setClassId] = useState<string>("");

    async function getReport() {
        if (reportInFlight) { return; }
        try {
            setReportInFlight(true);
            let reportInfo: ReportLearningOutcomeRequest = {
                profileId: profileId,
                programId: getDefaultProgId(),
                classId: classId
            };
            let responseReport: any = {}
            if (classId.length > 0) {
                responseReport = await restApi.getReportLearningOutcomeClass(reportInfo);
            } else {
                responseReport = await restApi.getReportLearningOutcomeList(reportInfo);
            }
            // console.log("report: ", responseReport);
            // TODO: Use get by ID list
            // let loIDs: number[] = [];
            // responseReport.learningOutcomes.map((lo) => {loIDs.push(lo.id)});
            const loInfoListResponse = await restApi.getLearningOutcomes();
            // console.log("loInfoListResponse", loInfoListResponse);
            // TODO: Use get by ID list
            let devSkillInfoListResponse = await restApi.getDevSkills();
            // console.log("devSkillInfoListResponse", devSkillInfoListResponse);

            let devSkillMap: Map<string, any> = new Map<string, any>();
            for (let j = 0; j < devSkillInfoListResponse.devSkills.length; ++j) {
                let loSkillList: number[] = [];
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

            let report: any[] = []
            // console.log("devSkillMap: ", devSkillMap)
            for (let key of devSkillMap.keys()) {
                let successNb = 0;
                let failureNb = 0;
                let loList = devSkillMap.get(key).loList
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
                let successRate = 0.0
                let failureRate = 0.0
                if (successNb > 0) {
                    successRate = successNb / loList.length * 100.0
                }
                if (failureNb > 0) {
                    failureRate = failureNb / loList.length * 100.0
                }
                report.push({ name: devSkillMap.get(key).name, success: successRate, failure: failureRate })
            }
            // console.log("report: ", report)
            setReport(report)
        } catch (e) {
            console.error(e)
            setReportError(<FormattedMessage id="ERROR_UNKOWN" />);
        } finally {
            setReportInFlight(false);
        }
    }

    return (
        <Grid container item>
            <Grid item xs={12}>
                <BadanamuTextField
                    fullWidth
                    value={profileId}
                    label="profileId"
                    type="text"
                    onChange={(e) => setProfileId(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <BadanamuTextField
                    fullWidth
                    value={classId}
                    label="classId (optional)"
                    type="text"
                    onChange={(e) => setClassId(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
                <BadanamuButton
                    extendedOnly
                    fullWidth
                    onClick={getReport}
                    size="large"
                    disabled={reportInFlight}
                >
                    {
                        reportInFlight ?
                            <CircularProgress size={25} /> :
                            "Report"
                    }
                </BadanamuButton>
            </Grid>
            <Grid item xs={12}>
                {report !== undefined ? <BarChart width={730} height={400} data={report}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="success" fill="#8884d8" />
                    <Bar dataKey="failure" fill="#6661e8" />
                </BarChart> : null}
            </Grid>
        </Grid>
    )
}