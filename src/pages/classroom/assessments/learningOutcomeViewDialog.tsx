import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import { TransitionProps } from "@material-ui/core/transitions";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AddIcon from "@material-ui/icons/Add";
import InfoIcon from '@material-ui/icons/Info';
import ErrorIcon from "@material-ui/icons/Error";
import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";

import DialogAppBar from "../../../components/styled/dialogAppBar";
import StyledFAB from "../../../components/styled/fabButton";
import StyledButton from "../../../components/styled/button";
import StyledTextField from "../../../components/styled/textfield";
import StyledComboBox from "../../../components/styled/combobox";
import { RestAPIError, RestAPIErrorType } from "../../../api/restapi_errors";
import {
    useRestAPI,
    LearningOutcomeResponse
} from "./api/restapi";

interface Props {
    loId: number | undefined
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
    }),
);

const Motion = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Grow style={{ transformOrigin: "0 0 0" }} ref={ref} {...props} />;
});

export default function LearningOutcomeViewDialog(props: Props) {
    const { loId, open, onClose } = props;
    const api = useRestAPI();

    const [info, setInfo] = useState<LearningOutcomeResponse>();

    async function fetchLOInfo() {
        if (typeof loId === "number") {
            const payload = await api.getLearningOutcome(loId);
            return payload;
        } else {
            return undefined;
        }
    }

    useEffect(() => {
        let prepared = true;

        (async () => {
            const info = await fetchLOInfo();
            if (prepared) { setInfo(info); }
        })();

        return () => { prepared = false; };
    }, [open])

    return (
        <>
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
                    subtitleID={"assess_viewDialogTitle"}
                />
                {info ? <ReadLearningOutcome info={info} /> : "Loading..."}
            </Dialog>
        </>
    );
}

function ReadLearningOutcome(props: { info: LearningOutcomeResponse }) {
    const { info } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const api = useRestAPI();

    const [devSkillName, setDevSkillName] = useState("");
    const [skillCatName, setSkillCatName] = useState("");

    async function getDevSkillName() {
        const payload = await api.getDevSkill(info.devSkillId);
        return payload.name;
    }

    async function getSkillCatName() {
        const payload = await api.getSkillCat(info.skillCatId);
        return payload.name;
    }

    useEffect(() => {
        let prepared = true;

        (async () => {
            const devSkillName = await getDevSkillName();
            const skillCatName = await getSkillCatName();

            if (prepared) {
                setDevSkillName(devSkillName);
                setSkillCatName(skillCatName);
            }
        })();

        return () => { prepared = false; };
    }, [devSkillName, skillCatName])

    const onClickEdit = () => {

    }

    return (
        <Grid
            container
            direction="row"
            justify="space-around"
            className={classes.menuContainer}
        >
            <Grid className={classes.menuGrid} item xs={12}>
                <Typography variant="caption" color="textSecondary">Title</Typography>
                <Typography variant="h6">{info.title + (info.assumed ? " (Assumed)" : "")}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                <Typography variant="caption" color="textSecondary">Created on</Typography>
                <Typography variant="subtitle1">{new Date(info.createdDate).toLocaleString()}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                <Typography variant="caption" color="textSecondary">Updated on</Typography>
                <Typography variant="subtitle1">{new Date(info.updatedDate).toLocaleString()}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                <Typography variant="caption" color="textSecondary">Development Skill</Typography>
                <Typography variant="subtitle1">{devSkillName}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                <Typography variant="caption" color="textSecondary">Skill Category</Typography>
                <Typography variant="subtitle1">{skillCatName}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                <Typography variant="caption" color="textSecondary">Estimated Hour</Typography>
                <Typography variant="subtitle1">{info.estimatedDuration ? info.estimatedDuration + " hrs" : "-"}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                <Typography variant="caption" color="textSecondary">Tags (Keyword)</Typography>
                <Typography variant="subtitle1">{info.tags === null ? "-" : info.tags.join(", ")}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={12}>
                <Typography variant="caption" color="textSecondary">Description</Typography>
                <Typography variant="subtitle1">{info.description === "" ? "-" : info.description}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} container justify="center" spacing={2} item>
                <DialogActions>
                    <StyledButton
                        extendedOnly
                        onClick={onClickEdit}
                    >
                        Edit
                    </StyledButton>
                </DialogActions>
            </Grid>
        </Grid>
    )
}
