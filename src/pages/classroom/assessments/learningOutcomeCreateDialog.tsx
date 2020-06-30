import Hidden from "@material-ui/core/Hidden";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { TransitionProps } from "@material-ui/core/transitions";
import AddIcon from "@material-ui/icons/Add";
import ErrorIcon from "@material-ui/icons/Error";
import React, { useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";

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
} from "./api/restapi";

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

export default function CreateLearningOutcomeDialog() {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const api = useRestAPI();

    async function getPublishedDevSkills() {
        const dRes = await api.getDevSkills();

        return dRes.devSkills.filter((skill: DevSkillResponse) => skill.published);
    }
    async function getPublishedSkillCats() {
        const sRes = await api.getSkillCats();

        return sRes.skillCats.filter((cat: SkillCatResponse) => cat.published);
    }

    const [open, setOpen] = useState(false);

    const [pubDevSkills, setPubDevSkills] = useState<DevSkillResponse[]>([]);
    const [pubSkillCats, setPubSkillCats] = useState<SkillCatResponse[]>([]);

    const [publish, setPublish] = useState(false);
    const [title, setTitle] = useState("");
    const [devSkills, setDevSkills] = useState<string[]>([]);
    const [devSkill, setDevSkill] = useState("");
    const [skillCats, setSkillCats] = useState<string[]>([]);
    const [skillCat, setSkillCat] = useState("");
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
        if (open) {
            setToday(new Date().toISOString().replace(/\T.*$/g, ""));

            let prepared = true;

            (async () => {
                const ds = await getPublishedDevSkills();
                const sc = await getPublishedSkillCats();
                setPubDevSkills(ds);
                setPubSkillCats(sc);

                if (prepared) {
                    if (ds.length > 0) {
                        const devSkills = ds.map((skill: DevSkillResponse) => skill.name)
                        setDevSkills(devSkills);
                    }
                    if (sc.length > 0) {
                        const skillCats = sc.map((cat: SkillCatResponse) => cat.name)
                        setSkillCats(skillCats);
                    }
                }
            })();

            return () => {
                prepared = false;
            };
        }
    }, [open])

    const handleChangeDevSkill = (e: any, value: string) => {
        if (e.target.value === undefined || value === null) {
            return setDevSkill("")
        } else {
            return setDevSkill(value);
        }
    }
    const handleChangeSkillCat = (e: any, value: string) => {
        if (e.target.value === undefined || value === null) {
            return setSkillCat("")
        } else {
            return setSkillCat(value)
        }
    }

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

            // TODO: Improvement logic to get each id to prevent situation about duplicated title
            // TODO: Handle when result is undefined
            const devSkillId = pubDevSkills.filter(skill => skill.name == devSkill)[0].devSkillId;
            const skillCatId = pubSkillCats.filter(cat => cat.name == skillCat)[0].skillCatId;

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
            }
            await api.createLearningOutcome(form)
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
                        <FormattedMessage id="error_emptyEmail" />
                    </span>,
                );
            } else if (e.toString().search("EMPTY_DEVSKILL") !== -1) {
                setDevSkillError(
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <ErrorIcon className={classes.errorIcon} />
                        <FormattedMessage id="error_emptyEmail" />
                    </span>,
                );
            } else if (e.toString().search("EMPTY_SKILLCAT") !== -1) {
                setSkillCatError(
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <ErrorIcon className={classes.errorIcon} />
                        <FormattedMessage id="error_emptyEmail" />
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
                <FormattedMessage id="assess_createButton" />
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
                                    Create <AddIcon style={{ paddingLeft: theme.spacing(1) }} />
                                </StyledFAB>
                            </Grid>
                        </Hidden>
                    }
                    handleClose={handleClose}
                    subtitleID={"assess_createDialogTitle"}
                />
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="stretch"
                    spacing={isMobile ? 1 : 3}
                    className={classes.menuContainer}
                >
                    <Grid item xs={isMobile ? 12 : 6}>
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
                    <Grid item xs={isMobile ? 12 : 6}>
                        <StyledTextField
                            disabled
                            fullWidth
                            value={today}
                            label={"Date"}
                        />
                    </Grid>
                    <Grid item xs={isMobile ? 12 : 6}>
                        <StyledComboBox
                            type="single"
                            options={devSkills}
                            label="Development Skill"
                            value={devSkill}
                            error={devSkillError !== null}
                            helperText={devSkillError}
                            onChange={handleChangeDevSkill}
                        />
                    </Grid>
                    <Grid item xs={isMobile ? 12 : 6}>
                        <StyledComboBox
                            type="single"
                            options={skillCats}
                            label="Skill Category"
                            value={skillCat}
                            error={skillCatError !== null}
                            helperText={skillCatError}
                            onChange={handleChangeSkillCat}
                        />
                    </Grid>
                    <Grid item xs={isMobile ? 12 : 6}>
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
                    <Grid item xs={isMobile ? 12 : 6}>
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
                    <Grid item xs={12}>
                        <StyledTextField
                            fullWidth
                            multiline
                            rows={3}
                            value={description}
                            label={"Description"}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid container justify="space-around" item xs={isMobile ? 12 : 6}>
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
