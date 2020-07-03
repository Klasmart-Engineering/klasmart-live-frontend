import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { TransitionProps } from "@material-ui/core/transitions";
import React, { useState, useEffect } from "react";

import DialogAppBar from "../../../components/styled/dialogAppBar";
import {
    useRestAPI,
    AssessmentResponse
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

    useEffect(() => {
        let prepared = true;

        (async () => {
            const info = await fetchAssessmentInfo();

            if (prepared) { setInfo(info); }
        })();

        return () => { prepared = false; };
    }, [open])

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
                handleClose={onClose}
                subtitleID={"assess_completedViewDialogTitle"}
            />
            <Grid
                container
                direction="row"
                justify="space-around"
                alignItems="stretch"
                spacing={isMobile ? 1 : 3}
                className={classes.menuContainer}
            >
                {info ? <AssessmentDetails ass={info} /> : "Loading..."}
            </Grid>
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
                    {ass.students.length === 0 ? "-" : ass.students.map((std) => std.profileName).join(", ")}
                </Typography>
            </Grid>
        </>
    )
}
