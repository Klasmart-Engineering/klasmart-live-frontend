import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import Hidden from "@material-ui/core/Hidden";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import { TransitionProps } from "@material-ui/core/transitions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import EditIcon from "@material-ui/icons/Edit";
import BlockIcon from "@material-ui/icons/Block";
import SaveIcon from "@material-ui/icons/Save";
import ErrorIcon from "@material-ui/icons/Error";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";

import { SkillCatOption, DevSkillOption } from "../../../types/objectTypes";
import DialogAppBar from "../../../components/styled/dialogAppBar";
import StyledFAB from "../../../components/styled/fabButton";
import StyledTextField from "../../../components/styled/textfield";
import StyledComboBox from "../../../components/styled/combobox";
import { RestAPIError } from "../../../api/restapi_errors";
import {
    useRestAPI,
    LearningOutcomeResponse,
    DevSkillResponse,
    SkillCatResponse,
    UpdateLearningOutcomeRequest,
} from "../../../api/restapi";

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
        cancelButton: {
            backgroundColor: "#ff6961",
            color: "white",
        },
        fab: {
            position: "fixed",
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
        speedDial: {
            position: "fixed",
            "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
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

export default function LearningOutcomeViewDialog(props: Props) {
    const api = useRestAPI();
    async function fetchPublishedSkillCats() {
        const payload = await api.getSkillCats();
        return payload.skillCats
            .sort((a, b) => b.createdDate - a.createdDate)
            .filter((cat: SkillCatResponse) => cat.published);
    }
    async function fetchPublishedDevSkills() {
        const payload = await api.getDevSkills();
        return payload.devSkills
            .sort((a, b) => b.createdDate - a.createdDate)
            .filter((skill: DevSkillResponse) => skill.published);
    }
    function getAvaiableDevSkills(
        publishedDevSkills: DevSkillResponse[],
        publishedSkillCats: SkillCatResponse[]
    ) {
        const devSkillOptions: DevSkillOption[] = [];
        const availableDevSkillIds = [...new Set(publishedSkillCats.map(cat => cat.devSkillId))];
        for (const id of availableDevSkillIds) {
            const target = publishedDevSkills.filter(ds => ds.devSkillId === id)[0];
            devSkillOptions.push({
                devSkillId: target.devSkillId,
                name: target.name
            });
        }
        return devSkillOptions;
    }
    async function fetchPublishedLearningOutcomes() {
        const payload = await api.getLearningOutcomes();
        return payload.learningOutcomes
            .sort((a, b) => b.createdDate - a.createdDate)
            .filter(lo => lo.published);
    }
    async function getDevSkillName(id: string) {
        const payload = await api.getDevSkill(id);
        return payload.name;
    }

    async function getSkillCatName(id: string) {
        const payload = await api.getSkillCat(id);
        return payload.name;
    }

    const { loId, open, onClose } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    async function fetchLOInfo() {
        if (typeof loId === "number") {
            const payload = await api.getLearningOutcome(loId);
            return payload;
        } else {
            return undefined;
        }
    }

    const handleOnClickEdit = () => {
        setEditMode(true);
    };

    const [editMode, setEditMode] = useState(false);
    const [info, setInfo] = useState<LearningOutcomeResponse>();

    const [publish, setPublish] = useState(false);
    const [title, setTitle] = useState("");
    const [devSkillOptions, setDevSkillOptions] = useState<DevSkillOption[]>([]);
    const [devSkillIdx, setDevSkillIdx] = useState<number>();
    const [devSkill, setDevSkill] = useState("");
    const [allSkillCatOptions, setAllSkillCatOptions] = useState<SkillCatOption[]>([]);
    const [skillCatOptions, setSkillCatOptions] = useState<SkillCatOption[]>([]);
    const [skillCatIdx, setSkillCatIdx] = useState<number>();
    const [skillCat, setSkillCat] = useState("");
    const [skillCatDisabled, setSkillCatDisabled] = useState(false);
    const [estimatedDuration, setEstimatedDuration] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagGuide, setTagGuide] = useState<string[]>(["Press Enter to add"]);
    const [description, setDescription] = useState("");
    const [assumed, setAssumed] = useState(false);
    const [inFlight, setInFlight] = useState(false);

    const [titleError, setTitleError] = useState<JSX.Element | null>(null);
    const [devSkillError, setDevSkillError] = useState<JSX.Element | null>(null);
    const [skillCatError, setSkillCatError] = useState<JSX.Element | null>(null);
    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    const [speedDialOpen, setSpeedDialOpen] = useState(false);
    const [speedDialHidden, setSpeedDialHidden] = useState(false);

    useEffect(() => {
        let prepared = true;

        (async () => {
            const info = await fetchLOInfo();
            let devSkillName = "", skillCatName = "";
            if (info) {
                devSkillName = await getDevSkillName(info.devSkillId);
                skillCatName = await getSkillCatName(info.skillCatId);
            }
            if (prepared) {
                setInfo(info);
                setDevSkill(devSkillName);
                setSkillCat(skillCatName);
            }
        })();

        return () => { prepared = false; };
    }, [open]);


    useEffect(() => {
        if (!info) { return; }
        setPublish(info.published);
        setTitle(info.title);
        setEstimatedDuration(info.estimatedDuration ? `${info.estimatedDuration}` : "");
        setTags(info.tags ? info.tags : []);
        setDescription(info.description);
        setAssumed(info.assumed);
    }, [info]);

    useEffect(() => {
        if (!editMode) { return; }
        let prepared = true;
        (async () => {
            const pubDevSkills = await fetchPublishedDevSkills();
            const pubSkillCats = await fetchPublishedSkillCats();
            if (prepared) {
                const skillCatOptions = pubSkillCats.map((cat: SkillCatResponse) => {
                    return {
                        devSkillId: cat.devSkillId,
                        skillCatId: cat.skillCatId,
                        name: cat.name
                    };
                });
                setAllSkillCatOptions(skillCatOptions);
                setSkillCatOptions(skillCatOptions);
                const devSkillNames = getAvaiableDevSkills(pubDevSkills, pubSkillCats);
                setDevSkillOptions(devSkillNames);
            }
        })();
        return () => { prepared = false; };
    }, [editMode]);

    useEffect(() => {
        if (!editMode) { return; }
        if (devSkill === "") {
            setSkillCatDisabled(true);
            setSkillCat("Select Development Skill first");
        } else {
            setSkillCatDisabled(false);
            setSkillCat("");
            const devSkillId = devSkillOptions[devSkillIdx].devSkillId;
            const skillCatList = allSkillCatOptions.filter(cat => cat.devSkillId == devSkillId);
            setSkillCatOptions(skillCatList);
        }
    }, [devSkill]);

    const handleChangeDevSkill = (e: any, value: string) => {
        const idx = e.target.getAttribute("data-option-index");
        if (idx === null || value === null) {
            setDevSkillIdx(null);
            setDevSkill("");
        } else {
            setDevSkillIdx(idx);
            setDevSkill(value);
        }
    };
    const handleChangeSkillCat = (e: any, value: string) => {
        const idx = e.target.getAttribute("data-option-index");
        if (idx === null || value === null) {
            setSkillCatIdx(null);
            setSkillCat("");
        } else {
            setSkillCatIdx(idx);
            setSkillCat(value);
        }
    };

    async function handleOnClickSave() {
        setTitleError(null);
        setDevSkillError(null);
        setSkillCatError(null);
        if (inFlight || !info) { return; }
        try {
            setInFlight(true);
            if (title === "") { throw new Error("EMPTY_TITLE"); }
            if (devSkill === "") { throw new Error("EMPTY_DEVSKILL"); }
            if (skillCat === "") { throw new Error("EMPTY_SKILLCAT"); }

            let devSkillIndex = devSkillIdx;
            if (!devSkillIndex) {
                devSkillIndex = devSkillOptions.findIndex((devSkillOpt) => devSkillOpt.name === devSkill);
            }
            let skillCatIndex = skillCatIdx;
            if (!skillCatIndex) {
                skillCatIndex = skillCatOptions.findIndex((skillCatOpt) => skillCatOpt.name === skillCat);
            }
            const devSkillId = devSkillOptions[devSkillIndex].devSkillId;
            const skillCatId = skillCatOptions[skillCatIndex].skillCatId;

            const form: UpdateLearningOutcomeRequest = {
                publish,
                title,
                devSkillId,
                skillCatId,
                assumed,
                description,
                estimatedDuration: estimatedDuration === "" ? 0 : Number(estimatedDuration),
                tags,
            };
            await api.updateLearningOutcome(info.loId, form);
            location.reload();
        } catch (e) {
            handleError(e);
        } finally {
            setInFlight(false);
        }
    }

    function handleError(e: RestAPIError | Error) {
        if (!(e instanceof RestAPIError)) {
            if (e.toString().search("EMPTY_TITLE") !== -1) {
                setTitleError(
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <ErrorIcon className={classes.errorIcon} />
                        <FormattedMessage id="error_emptyTitle" />
                    </span>,
                );
            } else if (e.toString().search("EMPTY_DEVSKILL") !== -1) {
                setDevSkillError(
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <ErrorIcon className={classes.errorIcon} />
                        <FormattedMessage id="error_emptyDevSkill" />
                    </span>,
                );
            } else if (e.toString().search("EMPTY_SKILLCAT") !== -1) {
                setSkillCatError(
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <ErrorIcon className={classes.errorIcon} />
                        <FormattedMessage id="error_emptySkillCat" />
                    </span>,
                );
            } else {
                console.error(e);
            }
            return;
        }
        const id = e.getErrorMessageID();
        const errorMessage = <FormattedMessage id={id} />;
        switch (e.getErrorMessageType()) {
        default:
            setGeneralError(errorMessage);
            break;
        }
    }


    const EDITMODE_ACTIONS = [
        { icon: <BlockIcon style={{ margin: 0 }} />, name: "Cancel", action: () => handleOnClickCancel() },
        { icon: <SaveIcon style={{ margin: 0 }} />, name: "Save", action: () => handleOnClickSave() },
    ];
    const handleOnClickCancel = () => {
        setPublish(false);
        setEditMode(false);
    };
    const handleSpeedDialClose = () => {
        setSpeedDialOpen(false);
    };
    const handleSpeedDialOpen = () => {
        setSpeedDialOpen(true);
    };
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
                    toolbarBtn={
                        <Hidden smDown>
                            {editMode ? <>
                                <Grid item>
                                    <StyledFAB className={classes.cancelButton} size="small" onClick={handleOnClickCancel}>
                                        Cancel <BlockIcon style={{ paddingLeft: theme.spacing(1) }} />
                                    </StyledFAB>
                                </Grid>
                                <Grid item style={{ marginLeft: 10 }}>
                                    <StyledFAB size="small" onClick={handleOnClickSave}>
                                        Save <SaveIcon style={{ paddingLeft: theme.spacing(1) }} />
                                    </StyledFAB>
                                </Grid>
                            </> :
                                <Grid item>
                                    <StyledFAB disabled={info && info.published} size="small" onClick={handleOnClickEdit}>
                                        Edit <EditIcon style={{ paddingLeft: theme.spacing(1) }} />
                                    </StyledFAB>
                                </Grid>
                            }
                        </Hidden>
                    }
                    handleClose={onClose}
                    subtitleID={editMode ? "assess_libraryEditDialogTitle" : "assess_libraryViewDialogTitle"}
                />
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    className={classes.menuContainer}
                >
                    {!info ? "Loading..." :
                        (editMode
                            ? (<>
                                <Grid className={classes.menuGrid} item xs={12}>
                                    <StyledTextField
                                        required
                                        fullWidth
                                        label="Learning Outcome Title"
                                        value={title}
                                        error={titleError !== null}
                                        helperText={titleError}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Grid>
                                <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                                    <StyledComboBox
                                        type="single"
                                        options={devSkillOptions.map(opt => opt.name)}
                                        label="Development Skill"
                                        value={devSkill}
                                        error={devSkillError !== null}
                                        helperText={devSkillError}
                                        onChange={handleChangeDevSkill}
                                    />
                                </Grid>
                                <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                                    <StyledComboBox
                                        disabled={skillCatDisabled}
                                        type="single"
                                        options={skillCatOptions.map(opt => opt.name)}
                                        label="Skill Category"
                                        value={skillCat}
                                        error={skillCatError !== null}
                                        helperText={skillCatError}
                                        onChange={handleChangeSkillCat}
                                    />
                                </Grid>
                                <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                                    <StyledTextField
                                        fullWidth
                                        type="number"
                                        inputProps={{ min: "0" }} // TODO: set max value as 9999
                                        value={estimatedDuration}
                                        label="Estimated Hours"
                                        onChange={(e) => setEstimatedDuration(e.target.value)}
                                        onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                    />
                                </Grid>
                                <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                                    <StyledTextField
                                        fullWidth
                                        placeholder="Please Separate by `,`"
                                        value={tags.join(",")}
                                        label={"Tags (Keywords)"}
                                        onChange={
                                            (e) => setTags(e.target.value.split(/\s*,\s/)) // TODO
                                        }
                                    />
                                </Grid>
                                <Grid className={classes.menuGrid} item xs={12}>
                                    <StyledTextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={description}
                                        label={"Description"}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Grid>
                                <Grid className={classes.menuGrid} container justify="space-around" item xs={isMobile ? 12 : 6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={assumed}
                                                onChange={() => setAssumed(!assumed)}
                                                name="check-assumed"
                                                color="primary"
                                            />
                                        }
                                        label="Assume"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={publish}
                                                onChange={() => setPublish(!publish)}
                                                name="check-publish"
                                                color="primary"
                                            />
                                        }
                                        label="Publish"
                                    />
                                </Grid>
                            </>)
                            : <LearningOutcomeDetails lo={info} devSkill={devSkill} skillCat={skillCat} />)
                    }
                </Grid>
                <Hidden mdUp>
                    {editMode ?
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
                            {EDITMODE_ACTIONS.map((action) => (
                                <SpeedDialAction
                                    key={action.name}
                                    icon={action.icon}
                                    tooltipTitle={action.name}
                                    onClick={action.action}
                                />
                            ))}
                        </SpeedDial> :
                        <StyledFAB className={classes.fab} disabled={info && info.published} size="small" onClick={handleOnClickEdit}>
                            <EditIcon />
                        </StyledFAB>
                    }
                </Hidden>
            </Dialog>
        </>
    );
}

interface LearningOutcomeDetailsProps {
    lo: LearningOutcomeResponse
    devSkill: string
    skillCat: string
}

function LearningOutcomeDetails(props: LearningOutcomeDetailsProps) {
    const { lo, devSkill, skillCat } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const api = useRestAPI();

    const [devSkillName, setDevSkillName] = useState("");
    const [skillCatName, setSkillCatName] = useState("");

    async function getDevSkillName() {
        const payload = await api.getDevSkill(lo.devSkillId);
        return payload.name;
    }

    async function getSkillCatName() {
        const payload = await api.getSkillCat(lo.skillCatId);
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
    }, [devSkillName, skillCatName]);

    return (
        <>
            {lo.published ?
                <Grid className={classes.menuGrid} item xs={12}>
                    <Typography variant="subtitle2" color="primary">
                        Published Learning Outcome can not be editable
                    </Typography>
                </Grid>
                : null
            }
            <Grid className={classes.menuGrid} item xs={12}>
                <Typography variant="caption" color="textSecondary">Title</Typography>
                <Typography variant="h6">{lo.title + (lo.assumed ? " (Assumed)" : "")}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                <Typography variant="caption" color="textSecondary">Created on</Typography>
                <Typography variant="subtitle1">{new Date(lo.createdDate).toLocaleString()}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                <Typography variant="caption" color="textSecondary">Updated on</Typography>
                <Typography variant="subtitle1">{new Date(lo.updatedDate).toLocaleString()}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                <Typography variant="caption" color="textSecondary">Development Skill</Typography>
                <Typography variant="subtitle1">{devSkill}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                <Typography variant="caption" color="textSecondary">Skill Category</Typography>
                <Typography variant="subtitle1">{skillCat}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                <Typography variant="caption" color="textSecondary">Estimated Hour</Typography>
                <Typography variant="subtitle1">{lo.estimatedDuration ? lo.estimatedDuration : "-"}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
                <Typography variant="caption" color="textSecondary">Tags (Keyword)</Typography>
                <Typography variant="subtitle1">{lo.tags === null ? "-" : lo.tags.join(", ")}</Typography>
            </Grid>
            <Grid className={classes.menuGrid} item xs={12}>
                <Typography variant="caption" color="textSecondary">Description</Typography>
                <Typography variant="subtitle1">{lo.description === "" ? "-" : lo.description}</Typography>
            </Grid>
        </>
    );
}
