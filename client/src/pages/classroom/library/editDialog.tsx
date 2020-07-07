import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import { TransitionProps } from "@material-ui/core/transitions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ErrorIcon from "@material-ui/icons/Error";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DoneIcon from '@material-ui/icons/Done';
import React, { useState, useRef, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";

import { SkillCatOption, DevSkillOption } from "../../../types/objectTypes";
import { ActionTypes, LibraryMenu } from "../../../store/actions";
import { State } from "../../../store/store";
import ResizedIframe from "../../../components/resizedIframe";
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
    UpdateLessonMaterialRequest,
    LessonMaterialResponse,
    UpdateLessonPlanRequest,
    CreateLessonMaterialLessonPlanRequest,
    LessonPlanResponse,
} from "../assessments/api/restapi";
import { contentTypes } from "../../../store/reducers";

interface Props {
    contentId: string
    contentType: "lesson-plan" | "lesson-material"
    open: boolean
    onClose: any
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: "relative",
        },
        fab: {
            bottom: theme.spacing(2),
            position: "fixed",
            right: theme.spacing(2),
        },
        rootList: {
            overflow: 'auto',
            maxHeight: 400,
        },
        listHeader: {
            backgroundColor: 'white',
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

export default function EditDialog(props: Props) {
    const { contentId, contentType, open, onClose } = props;
    const api = useRestAPI();
    async function getContent() {
        if (contentType === "lesson-material") {
            return api.getLessonMaterial(contentId);
        } else if (contentType === "lesson-plan") {
            return api.getLessonPlan(contentId);
        }
    }
    async function fetchPublishedLessonMaterials() {
        const payload = await api.getLessonMaterials();
        return payload.lessonMaterials
            .filter((cat: SkillCatResponse) => cat.published)
            .sort((a, b) => b.createdDate - a.createdDate);
    }
    async function fetchPublishedSkillCats() {
        const payload = await api.getSkillCats();
        return payload.skillCats
            .filter((cat: SkillCatResponse) => cat.published)
            .sort((a, b) => b.createdDate - a.createdDate);
    }
    async function fetchPublishedDevSkills() {
        const payload = await api.getDevSkills();
        return payload.devSkills
            .filter((skill: DevSkillResponse) => skill.published)
            .sort((a, b) => b.createdDate - a.createdDate);
    }
    function getAvaiableDevSkills(
        publishedDevSkills: DevSkillResponse[],
        publishedSkillCats: SkillCatResponse[]
    ) {
        let devSkillOptions: DevSkillOption[] = [];
        const availableDevSkillIds = [...new Set(publishedSkillCats.map(cat => cat.devSkillId))];
        for (const id of availableDevSkillIds) {
            const target = publishedDevSkills.filter(ds => ds.devSkillId === id)[0]
            devSkillOptions.push({
                devSkillId: target.devSkillId,
                name: target.name
            });
        }
        return devSkillOptions
    }
    async function fetchPublishedLearningOutcomes() {
        const payload = await api.getLearningOutcomes();
        return payload.learningOutcomes
            .sort((a, b) => b.createdDate - a.createdDate)
            .filter(lo => lo.published);
    }

    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
    const store = useStore();

    const setActiveMenu = (value: LibraryMenu) => {
        store.dispatch({ type: ActionTypes.ACTIVE_LIBRARY_MENU, payload: value });
    };
    const typeOptions = useSelector((state: State) => state.account.contentTypes);
    const pubRangeOptions = useSelector((state: State) => state.account.publicRange);
    const suitAgeOptions = useSelector((state: State) => state.account.suitableAges);
    const activities = useSelector((state: State) => state.account.activities);

    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState<LessonPlanResponse | LessonMaterialResponse>();
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [pubRange, setPubRange] = useState("");
    const [suitAge, setSuitAge] = useState("");
    const [description, setDescription] = useState("");
    const [devSkillOptions, setDevSkillOptions] = useState<DevSkillOption[]>([]);
    const [devSkillIdx, setDevSkillIdx] = useState<number>();
    const [devSkill, setDevSkill] = useState("");
    const [allSkillCatOptions, setAllSkillCatOptions] = useState<SkillCatOption[]>([]);
    const [skillCatOptions, setSkillCatOptions] = useState<SkillCatOption[]>([]);
    const [skillCatIdx, setSkillCatIdx] = useState<number>();
    const [skillCat, setSkillCat] = useState("");
    const [skillCatDisabled, setSkillCatDisabled] = useState(true);
    const [LOs, setLOs] = useState<LearningOutcomeResponse[]>([]);
    const [checkedLOs, setCheckedLOs] = useState<number[]>([]);
    const [H5P, setH5P] = useState("");
    const [activityId, setActivityId] = useState("");
    const [activityPlay, setActivityPlay] = useState(false);
    const [LMs, setLMs] = useState<LessonMaterialResponse[]>([]);
    const [checkedLMs, setCheckedLMs] = useState<string[]>([]);

    const [inFlight, setInFlight] = useState(false);
    const [H5PError, setH5PError] = useState<JSX.Element | null>(null);
    const [titleError, setTitleError] = useState<JSX.Element | null>(null);
    const [typeError, setTypeError] = useState<JSX.Element | null>(null);
    const [pubRangeError, setPubRangeError] = useState<JSX.Element | null>(null);
    const [suitAgeError, setSuitAgeError] = useState<JSX.Element | null>(null);
    const [devSkillError, setDevSkillError] = useState<JSX.Element | null>(null);
    const [skillCatError, setSkillCatError] = useState<JSX.Element | null>(null);
    const [descriptionError, setDescriptionError] = useState<JSX.Element | null>(null);
    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);
    const [LOsError, setLOsError] = useState("");
    const [LMsError, setLMsError] = useState("");

    useEffect(() => {
        if (!open) { return; }
        let prepared = true;
        (async () => {
            const content = await getContent();
            const LMs = await fetchPublishedLessonMaterials();
            const pubDevSkills = await fetchPublishedDevSkills();
            const pubSkillCats = await fetchPublishedSkillCats();
            const los = await fetchPublishedLearningOutcomes();
            let devSkillName = "", skillCatName = "";
            if (content) {
                devSkillName = (await api.getDevSkill(content.devSkillId)).name;
                skillCatName = (await api.getSkillCat(content.skillCatId)).name;
            }
            if (prepared) {
                const skillCatOptions = pubSkillCats.map((cat: SkillCatResponse) => {
                    return {
                        devSkillId: cat.devSkillId,
                        skillCatId: cat.skillCatId,
                        name: cat.name
                    }
                });
                setInfo(content);

                setSkillCatDisabled(false);
                setLMs(LMs);
                setAllSkillCatOptions(skillCatOptions);
                setSkillCatOptions(skillCatOptions);
                const devSkillNames = getAvaiableDevSkills(pubDevSkills, pubSkillCats);
                setDevSkillOptions(devSkillNames);
                setLOs(los);
                if (content) {
                    setDevSkill(devSkillName);
                    setSkillCat(skillCatName);
                }
            }
        })();
        return () => { prepared = false; };
    }, [open])

    useEffect(() => {
        if (!open) { return; }
        if (devSkill === "") {
            setSkillCatDisabled(true);
            setSkillCat("Select Development Skill first");
        } else {
            setSkillCatDisabled(false);
            const devSkillId = devSkillOptions.filter(opt => opt.name === devSkill).devSkillId;
            const skillCatList = allSkillCatOptions.filter(cat => cat.devSkillId == devSkillId);
            setSkillCatOptions(skillCatList);
        }
    }, [devSkill])

    useEffect(() => {
        if (!info) { return; }
        if (contentType === "lesson-material") {
            setType(typeOptions[info.type - 1]);
            if (info.externalId) {
                setH5P(activities.filter(a => a.id === info.externalId)[0].title);
                setActivityId(info.externalId);
            } else {
                setH5P(activities[0].title);
                setActivityId(activities[0].id);
            }
        } else if (contentType === "lesson-plan") {
            setCheckedLMs(info.lessonMaterials
                ? info.lessonMaterials.map(m => m.lessonMaterialId)
                : [])
        }
        setTitle(info.name);
        setPubRange(pubRangeOptions[info.publicRange - 1]);
        setSuitAge(suitAgeOptions[info.suitableAge - 1]);
        setDescription(info.description);
        setCheckedLOs(info.learningOutcomes ? info.learningOutcomes : []);
    }, [info])

    const handleClickPlay = () => { setActivityPlay(true); }
    const handleChangeH5P = (e: any, value: string) => {
        const idx = e.target.getAttribute("data-option-index");
        if (idx === null || value === null) {
            setActivityId("");
            setH5P("");
        } else {
            setActivityId(activities[idx].id);
            setH5P(value);
        }
    }
    const handleChangeType = (e: any, value: string) => {
        const idx = e.target.getAttribute("data-option-index");
        if (idx === null || value === null) {
            setType("");
        } else {
            setType(value);
        }
    }
    const handleChangePubRange = (e: any, value: string) => {
        const idx = e.target.getAttribute("data-option-index");
        if (idx === null || value === null) {
            setPubRange("");
        } else {
            setPubRange(value);
        }
    }
    const handleChangeSuitAge = (e: any, value: string) => {
        const idx = e.target.getAttribute("data-option-index");
        if (idx === null || value === null) {
            setSuitAge("");
        } else {
            setSuitAge(value);
        }
    }
    const handleChangeDevSkill = (e: any, value: string) => {
        const idx = e.target.getAttribute("data-option-index");
        if (idx === null || value === null) {
            setDevSkillIdx(null);
            setDevSkill("");
        } else {
            setDevSkillIdx(idx);
            setDevSkill(value);
        }
    }
    const handleChangeSkillCat = (e: any, value: string) => {
        const idx = e.target.getAttribute("data-option-index");
        if (idx === null || value === null) {
            setSkillCatIdx(null);
            setSkillCat("");
        } else {
            setSkillCatIdx(idx);
            setSkillCat(value);
        }
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

    const handleOnClickLM = (lmId: string) => {
        const currentIndex = checkedLMs.indexOf(lmId);
        const newChecked = [...checkedLMs];
        if (currentIndex === -1) {
            newChecked.push(lmId);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setCheckedLMs(newChecked);
    }

    async function handleOnClickSubmit() {
        setH5PError(null);
        setTitleError(null);
        setTypeError(null);
        setPubRangeError(null);
        setSuitAgeError(null);
        setDevSkillError(null);
        setSkillCatError(null);
        setDescriptionError(null);
        setLOsError("");
        setLMsError("");
        if (inFlight) { return; }
        try {
            setInFlight(true);
            if (contentType === "lesson-material" && activityId === "") { throw new Error("EMPTY_ACTIVITY"); }
            if (contentType === "lesson-material" && type === "") { throw new Error("EMPTY_TYPE"); }
            if (title === "") { throw new Error("EMPTY_TITLE"); }
            if (pubRange === "") { throw new Error("EMPTY_PUBRANGE"); }
            if (suitAge === "") { throw new Error("EMPTY_SUITAGE"); }
            if (devSkill === "") { throw new Error("EMPTY_DEVSKILL"); }
            if (skillCat === "") { throw new Error("EMPTY_SKILLCAT"); }
            if (description === "") { throw new Error("EMPTY_DESCRIPTION"); }
            if (checkedLOs.length === 0) { return setLOsError("Select Learning Outcomes"); }
            if (contentType === "lesson-plan" && checkedLMs.length === 0) { return setLMsError("Select Lesson Materials"); }

            const externalId = activityId;
            const typeIdx = typeOptions.indexOf(type) + 1;
            const pubRangeIdx = pubRangeOptions.indexOf(pubRange) + 1;
            const suitAgeIdx = suitAgeOptions.indexOf(suitAge) + 1;
            const devSkillId = devSkillOptions[devSkillIdx].devSkillId;
            const skillCatId = skillCatOptions[skillCatIdx].skillCatId;

            if (contentType === "lesson-material") {
                const req: UpdateLessonMaterialRequest = {
                    publish: true,
                    externalId,
                    name: title,
                    type: typeIdx,
                    publicRange: pubRangeIdx,
                    suitableAge: suitAgeIdx,
                    devSkillId,
                    skillCatId,
                    description,
                    learningOutcomes: checkedLOs
                }
                const lmId = await api.createLessonMaterial(contentId, req);
            } else if (contentType === "lesson-plan") {
                let loList: number[] = [];
                let details: CreateLessonMaterialLessonPlanRequest[] = [];
                for (const lmId of checkedLMs) {
                    const lm = await api.getLessonMaterial(lmId);
                    if (lm.learningOutcomes) {
                        loList = [...lm.learningOutcomes]
                    }
                    details.push({
                        lessonMaterialId: lm.lessonMaterialId,
                        title: lm.name,
                        description: lm.description,
                        duration: 1 // TODO: Figure out it is requirement
                    })
                }
                loList = [...checkedLOs];
                const req: UpdateLessonPlanRequest = {
                    publish: false,
                    name: title,
                    publicRange: pubRangeIdx,
                    suitableAge: suitAgeIdx,
                    devSkillId,
                    skillCatId,
                    description,
                    learningOutcomes: [...new Set(loList)], // Remove duplicate
                    details
                };
                const lpId = await api.updateLessonPlan(contentId, req);
            }
            setActiveMenu("pending");
            onClose()
            location.reload();
        } catch (e) {
            handleError(e);
        } finally {
            setInFlight(false);
        }
    }

    function handleError(e: RestAPIError | Error) {
        if (!(e instanceof RestAPIError)) {
            if (e.toString().search("EMPTY_ACTIVITY") !== -1) {
                setH5PError(
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <ErrorIcon className={classes.errorIcon} />
                        <FormattedMessage id="error_emptyActivity" />
                    </span>,
                );
            } else if (e.toString().search("EMPTY_TITLE") !== -1) {
                setTitleError(
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <ErrorIcon className={classes.errorIcon} />
                        <FormattedMessage id="error_emptyTitle" />
                    </span>,
                );
            } else if (e.toString().search("EMPTY_TYPE") !== -1) {
                setTypeError(
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <ErrorIcon className={classes.errorIcon} />
                        <FormattedMessage id="error_emptyType" />
                    </span>,
                );
            } else if (e.toString().search("EMPTY_PUBRANGE") !== -1) {
                setPubRangeError(
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <ErrorIcon className={classes.errorIcon} />
                        <FormattedMessage id="error_emptyPubRange" />
                    </span>,
                );
            } else if (e.toString().search("EMPTY_SUITAGE") !== -1) {
                setSuitAgeError(
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <ErrorIcon className={classes.errorIcon} />
                        <FormattedMessage id="error_emptySuitAge" />
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
            } else if (e.toString().search("EMPTY_DESCRIPTION") !== -1) {
                setDescriptionError(
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <ErrorIcon className={classes.errorIcon} />
                        <FormattedMessage id="error_emptyDescription" />
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
                            <Grid item>
                                <StyledFAB size="small" onClick={handleOnClickSubmit}>
                                    Submit
                                    <DoneIcon style={{ paddingLeft: theme.spacing(1) }} />
                                </StyledFAB>
                            </Grid>
                        </Hidden>
                    }
                    handleClose={onClose}
                    subtitleID="library_editContentTitle"
                />
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="stretch"
                    className={classes.menuContainer}
                >
                    {contentType === "lesson-material" ?
                        <>
                            <Grid className={classes.menuGrid} item xs={12}>
                                <StyledComboBox
                                    type="single"
                                    options={activities.map(a => a.title)}
                                    label="Activity"
                                    value={H5P}
                                    error={H5PError !== null}
                                    helperText={H5PError}
                                    onChange={handleChangeH5P}
                                />
                            </Grid>
                            {activityId === "" ? null : <>
                                <Grid className={classes.menuGrid} item xs={12} container direction="row" justify="center" alignItems="center">
                                    <Typography variant="subtitle1">
                                        Do you wanna try this activity?
                                </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={handleClickPlay}
                                        style={{ marginLeft: 5, backgroundColor: "#0E78D5" }}
                                    >
                                        <PlayArrowIcon style={{ color: "#fff" }} />
                                    </IconButton>
                                </Grid>
                                {activityId === "" || !activityPlay ? null : <ResizedIframe contentId={activityId} />}
                            </>}
                            <Grid className={classes.menuGrid} item xs={isSmDown ? 12 : 6}>
                                <StyledTextField
                                    required
                                    fullWidth
                                    label="Content Title"
                                    value={title}
                                    error={titleError !== null}
                                    helperText={titleError}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Grid>
                            <Grid className={classes.menuGrid} item xs={isSmDown ? 12 : 6}>
                                <StyledComboBox
                                    type="single"
                                    options={typeOptions}
                                    label="Content Type"
                                    value={type}
                                    error={typeError !== null}
                                    helperText={typeError}
                                    onChange={handleChangeType}
                                />
                            </Grid>
                        </> :
                        <Grid className={classes.menuGrid} item xs={12}>
                            <StyledTextField
                                required
                                fullWidth
                                label="Content Title"
                                value={title}
                                error={titleError !== null}
                                helperText={titleError}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Grid>
                    }
                    <Grid className={classes.menuGrid} item xs={isSmDown ? 12 : 6}>
                        <StyledComboBox
                            type="single"
                            options={pubRangeOptions}
                            label="Public Range"
                            value={pubRange}
                            error={pubRangeError !== null}
                            helperText={pubRangeError}
                            onChange={handleChangePubRange}
                        />
                    </Grid>
                    <Grid className={classes.menuGrid} item xs={isSmDown ? 12 : 6}>
                        <StyledComboBox
                            type="single"
                            options={suitAgeOptions}
                            label="Suitable Ages"
                            value={suitAge}
                            error={suitAgeError !== null}
                            helperText={suitAgeError}
                            onChange={handleChangeSuitAge}
                        />
                    </Grid>
                    <Grid className={classes.menuGrid} item xs={isSmDown ? 12 : 6}>
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
                    <Grid className={classes.menuGrid} item xs={isSmDown ? 12 : 6}>
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
                    <Grid className={classes.menuGrid} item xs={12}>
                        <StyledTextField
                            fullWidth
                            multiline
                            rows={3}
                            value={description}
                            label={"Description"}
                            error={descriptionError !== null}
                            helperText={descriptionError}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid className={classes.menuGrid} item xs={12}>
                        <List
                            className={classes.rootList}
                            component="nav"
                            disablePadding
                            subheader={
                                <ListSubheader className={classes.listHeader} component="div" id="nested-list-subheader">
                                    Learning Outcomes *
                                {LOsError === "" ? null :
                                        <span style={{ display: "flex", alignItems: "center" }}>
                                            <ErrorIcon className={classes.errorIcon} color="error" />
                                            <Typography variant="caption" color="secondary">{LOsError}</Typography>
                                        </span>
                                    }
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
                    </Grid>
                    {contentType === "lesson-material" ? null :
                        <Grid className={classes.menuGrid} item xs={12}>
                            <List
                                className={classes.rootList}
                                component="nav"
                                disablePadding
                                subheader={
                                    <ListSubheader className={classes.listHeader} component="div" id="nested-list-subheader">
                                        Lesson Materials *
                                                {LMsError === "" ? null :
                                            <span style={{ display: "flex", alignItems: "center" }}>
                                                <ErrorIcon className={classes.errorIcon} color="error" />
                                                <Typography variant="caption" color="secondary">{LMsError}</Typography>
                                            </span>
                                        }
                                    </ListSubheader>
                                }
                            >
                                {LMs.map((lm, index) =>
                                    <ListItem key={lm.lessonMaterialId} button onClick={() => handleOnClickLM(lm.lessonMaterialId)}>
                                        <ListItemText primary={lm.name} />
                                        <ListItemIcon>
                                            <Checkbox
                                                checked={checkedLMs.indexOf(lm.lessonMaterialId) !== -1}
                                                color="primary"
                                            />
                                        </ListItemIcon>
                                    </ListItem>
                                )}
                            </List>
                        </Grid>
                    }
                </Grid>
                <Hidden mdUp>
                    <StyledFAB className={classes.fab} size="small" onClick={handleOnClickSubmit}>
                        <DoneIcon />
                    </StyledFAB>
                </Hidden>
            </Dialog>
        </>
    );
}
