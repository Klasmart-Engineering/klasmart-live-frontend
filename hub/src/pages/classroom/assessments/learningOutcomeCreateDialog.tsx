import Hidden from "@material-ui/core/Hidden";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { TransitionProps } from "@material-ui/core/transitions";
import AddIcon from "@material-ui/icons/Add";
import ErrorIcon from "@material-ui/icons/Error";
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
    CreateLearningOutcomeRequest,
    DevSkillResponse,
    SkillCatResponse
} from "../../../api/restapi";

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

export default function CreateLearningOutcomeDialog() {
    const api = useRestAPI();
    async function fetchPublishedSkillCats() {
        const payload = await api.getSkillCats();
        return payload.skillCats
            .sort((a, b) => b.updatedDate - a.updatedDate)
            .filter((cat: SkillCatResponse) => cat.published);
    }
    async function fetchPublishedDevSkills() {
        const payload = await api.getDevSkills();
        return payload.devSkills
            .sort((a, b) => b.updatedDate - a.updatedDate)
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

    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [open, setOpen] = useState(false);

    const [publish, setPublish] = useState(false);
    const [title, setTitle] = useState("");
    const [devSkillOptions, setDevSkillOptions] = useState<DevSkillOption[]>([]);
    const [devSkillIdx, setDevSkillIdx] = useState<number>();
    const [devSkill, setDevSkill] = useState("");
    const [allSkillCatOptions, setAllSkillCatOptions] = useState<SkillCatOption[]>([]);
    const [skillCatOptions, setSkillCatOptions] = useState<SkillCatOption[]>([]);
    const [skillCatIdx, setSkillCatIdx] = useState<number>();
    const [skillCat, setSkillCat] = useState("");
    const [skillCatDisabled, setSkillCatDisabled] = useState(true);
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

    const [today, setToday] = useState("");

    const handleClickOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

    useEffect(() => {
        if (!open) { return; }
        setToday(new Date().toISOString().replace(/\T.*$/g, ""));
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
                console.log(skillCatOptions, devSkillNames);
            }
        })();
        return () => { prepared = false; };
    }, [open]);

    useEffect(() => {
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
    }, [devSkill, devSkillIdx]);

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

    async function handleOnClickCreate() {
        setTitleError(null);
        setDevSkillError(null);
        setSkillCatError(null);
        if (inFlight) { return; }
        try {
            setInFlight(true);
            if (title === "") { throw new Error("EMPTY_TITLE"); }
            if (devSkill === "") { throw new Error("EMPTY_DEVSKILL"); }
            if (skillCat === "") { throw new Error("EMPTY_SKILLCAT"); }

            const devSkillId = devSkillOptions[devSkillIdx].devSkillId;
            const skillCatId = skillCatOptions[skillCatIdx].skillCatId;

            const form: CreateLearningOutcomeRequest = {
                publish,
                title,
                progId: "test-program-id",
                devSkillId,
                skillCatId,
                assumed,
                description,
                estimatedDuration: estimatedDuration === "" ? 0 : Number(estimatedDuration),
                tags,
            };
            await api.createLearningOutcome(form);
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

    return (
        <>
            <StyledFAB
                extendedOnly
                onClick={handleClickOpen}
                aria-label="create new learning outcome button"
            >
                <FormattedMessage id="button_create" />
                <AddIcon fontSize="small" />
            </StyledFAB>
            <Dialog
                aria-labelledby="nav-menu-title"
                aria-describedby="nav-menu-description"
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Motion}
            >
                <DialogAppBar
                    toolbarBtn={
                        <Hidden smDown>
                            <Grid item>
                                <StyledFAB size="small" onClick={handleOnClickCreate}>
                                    <FormattedMessage id="button_create" />
                                    <AddIcon style={{ paddingLeft: theme.spacing(1) }} />
                                </StyledFAB>
                            </Grid>
                        </Hidden>
                    }
                    handleClose={handleClose}
                    subtitleID={"assess_libraryCreateDialogTitle"}
                />
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="stretch"
                    className={classes.menuContainer}
                >
                    <Grid className={classes.menuGrid} item xs={isMobile ? 12 : 6}>
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
                        <StyledTextField
                            disabled
                            fullWidth
                            value={today}
                            label={"Date"}
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
                            inputProps={{ min: "0", max: "9999", maxLength: 4 }} // TODO: set max value as 9999
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
                    <Grid
                        className={classes.menuGrid}
                        container justify="space-around"
                        item
                        xs={isMobile ? 12 : 6}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={assumed}
                                    onChange={() => setAssumed(!assumed)}
                                    name="check-assumed"
                                    color="primary"
                                />
                            }
                            label="Assumed"
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
                </Grid>
                <Hidden mdUp>
                    <StyledFAB className={classes.fab} size="small" onClick={handleOnClickCreate}>
                        <AddIcon />
                    </StyledFAB>
                </Hidden>
            </Dialog>
        </>
    );
}
