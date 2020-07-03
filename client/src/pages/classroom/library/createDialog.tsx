import Hidden from "@material-ui/core/Hidden";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Grow from "@material-ui/core/Grow";
import List from "@material-ui/core/List";
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import { TransitionProps } from "@material-ui/core/transitions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AddIcon from "@material-ui/icons/Add";
import ErrorIcon from "@material-ui/icons/Error";
import React, { useState, useRef, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useSelector, useStore } from "react-redux";

import { SkillCatOption, DevSkillOption } from "../../../types/objectTypes";
import { ActionTypes } from "../../../store/actions";
import { State } from "../../../store/store";
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
    CreateLessonMaterialRequest,
} from "../assessments/api/restapi";

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

export default function CreateDialog() {
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
    const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

    const typeOptions = useSelector((state: State) => state.account.contentTypes);
    const pubRangeOptions = useSelector((state: State) => state.account.publicRange);
    const suitAgeOptions = useSelector((state: State) => state.account.suitableAges);

    const [open, setOpen] = useState(true);
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

    const [inFlight, setInFlight] = useState(false);
    const [titleError, setTitleError] = useState<JSX.Element | null>(null);
    const [typeError, setTypeError] = useState<JSX.Element | null>(null);
    const [pubRangeError, setPubRangeError] = useState<JSX.Element | null>(null);
    const [suitAgeError, setSuitAgeError] = useState<JSX.Element | null>(null);
    const [devSkillError, setDevSkillError] = useState<JSX.Element | null>(null);
    const [skillCatError, setSkillCatError] = useState<JSX.Element | null>(null);
    const [generalError, setGeneralError] = useState<JSX.Element | null>(null);

    useEffect(() => {
        let prepared = true;
        (async () => {
            const pubDevSkills = await fetchPublishedDevSkills();
            const pubSkillCats = await fetchPublishedSkillCats();
            const los = await fetchPublishedLearningOutcomes();
            if (prepared) {
                const skillCatOptions = pubSkillCats.map((cat: SkillCatResponse) => {
                    return {
                        devSkillId: cat.devSkillId,
                        skillCatId: cat.skillCatId,
                        name: cat.name
                    }
                });
                setAllSkillCatOptions(skillCatOptions);
                setSkillCatOptions(skillCatOptions);
                const devSkillNames = getAvaiableDevSkills(pubDevSkills, pubSkillCats);
                setDevSkillOptions(devSkillNames);
                setLOs(los);
            }
        })();
        return () => { prepared = false; };
    }, [])

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
    }, [devSkill])

    const handleClickOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

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

    async function handleOnClickCreate() {
        setTitleError(null);
        setDevSkillError(null);
        setSkillCatError(null);
        if (inFlight) { return; }
        try {
            setInFlight(true);
            if (title === "") { throw new Error("EMPTY_TITLE"); }
            if (type === "") { throw new Error("EMPTY_TYPE"); }
            if (pubRange === "") { throw new Error("EMPTY_PUBRANGE"); }
            if (suitAge === "") { throw new Error("EMPTY_SUITAGE"); }
            if (devSkill === "") { throw new Error("EMPTY_DEVSKILL"); }
            if (skillCat === "") { throw new Error("EMPTY_SKILLCAT"); }

            const typeIdx = typeOptions.indexOf(type) + 1;
            const pubRangeIdx = pubRangeOptions.indexOf(pubRange) + 1;
            const suitAgeIdx = suitAgeOptions.indexOf(suitAge) + 1;
            const devSkillId = devSkillOptions[devSkillIdx];
            const skillCatId = skillCatOptions[skillCatIdx];
            console.log(typeIdx, pubRangeIdx, suitAgeIdx)
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
                size={isMdDown ? "small" : undefined}
                onClick={handleClickOpen}
                aria-label="create new lesson or material button"
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
                    subtitleID="library_createContentTitle"
                />
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="stretch"
                    className={classes.menuContainer}
                >
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
                        <List
                            className={classes.rootList}
                            component="nav"
                            disablePadding
                            subheader={
                                <ListSubheader className={classes.listHeader} component="div" id="nested-list-subheader">
                                    Select Learning Outcomes
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
                    {/* <H5PEditor src="/h5p/new" /> */}
                </Grid>
            </Dialog>
        </>
    );
}

import IframeResizer from "iframe-resizer-react";

export interface Props {
    src: string;
    frameProps?: React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
}

function H5PEditor(props: Props): JSX.Element {
    const { src, frameProps } = props;
    const ref = useRef<HTMLIFrameElement>(null);

    const [key, setKey] = useState(Math.random());
    const [width, setWidth] = useState<string | number>("100%");
    const [maxHeight, setMaxHeight] = useState<number>(window.innerHeight * 0.5);
    const [numRenders, setRenders] = useState(0);

    const fitToScreen = (width: number, height: number) => {
        console.log("RESIZING!!!");
        const scale = maxHeight / Number(height);

        console.log(`height ${height}, width ${width}`);
        console.log(`maxHeight ${maxHeight}`);
        console.log(`scale ${scale}`);
        console.log(`NUMBER OF RENDERS ${numRenders}`);
        if (scale < 0.9) {
            setRenders(numRenders + 1);
            setWidth(Number(width) * scale);
            setKey(Math.random());
        }
    };

    function removelistner() {
        console.log("Remove!!!")
    }
    useEffect(() => {
        const innerRef = window.document.getElementById("recordedIframe-container") as HTMLIFrameElement;
        if (!innerRef || !innerRef.ownerDocument.defaultView) { return; }
        innerRef.addEventListener("load", inject);

        function inject() {
            // console.log("inject");
            if (!innerRef || !innerRef.contentDocument) { return; }
            const doc = innerRef.contentDocument;
            const h5pForm = doc.getElementById("h5p-content-form");
            if (!h5pForm || !h5pForm.ownerDocument.defaultView) { return; }
            // h5pForm.setAttribute("data-iframe-width", "100%");
            h5pForm.setAttribute("data-iframe-height", "");
            // console.log("@@@@@@@@@@@@: ", h5pForm.ownerDocument.defaultView.location)

            function receiveContentId(event: any) {
                event.preventDefault()
                console.log("11111")
                if (!h5pForm || !h5pForm.ownerDocument.defaultView) { return; }
                const content = h5pForm.ownerDocument.getElementsByClassName("h5p-content")[0]
                console.log("content: ", content)

                if (!content) { return; }
                console.log("h5pForm: ", content.getAttribute("data-content-id"))
            }
            h5pForm.addEventListener("submit", receiveContentId);

            const script2 = doc.createElement("script");
            script2.setAttribute("type", "text/javascript");
            script2.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.8/iframeResizer.contentWindow.min.js");
            doc.head.appendChild(script2);

        }
        innerRef.addEventListener("load", inject);
        return () => innerRef.removeEventListener("load", inject);
    }, [ref.current]);

    useEffect(() => {
        const innerRef = window.document.getElementById("recordedIframe-container") as HTMLIFrameElement;
        if (!innerRef || !innerRef.contentWindow) { return; }
        innerRef.addEventListener("load", inject);
        function inject() {
            // console.log("inject");
            if (!innerRef || !innerRef.contentDocument) { return; }
            const doc = innerRef.contentDocument;
            innerRef.height = `${doc.body.scrollHeight}px`;

            const h5pForm = doc.getElementById("h5p-content-form");
            if (!h5pForm || !h5pForm.ownerDocument.defaultView) { return; }
            // h5pForm.setAttribute("data-iframe-width", "100%");
            h5pForm.setAttribute("data-iframe-height", "");
            // console.log("@@@@@@@@@@@@: ", h5pForm.ownerDocument.defaultView.location)

            function receiveContentId(event: any) {
                event.preventDefault()
                console.log("11111")
                if (!h5pForm || !h5pForm.ownerDocument.defaultView) { return; }
                const content = h5pForm.ownerDocument.getElementsByClassName("h5p-content")[0]
                console.log("content: ", content)

                if (!content) { return; }
                console.log("h5pForm: ", content.getAttribute("data-content-id"))
            }
            h5pForm.addEventListener("submit", receiveContentId);

            const script2 = doc.createElement("script");
            script2.setAttribute("type", "text/javascript");
            script2.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.8/iframeResizer.contentWindow.min.js");
            doc.head.appendChild(script2);

        }
        innerRef.addEventListener("load", inject);
        return () => innerRef.removeEventListener("load", inject);
    }, [ref.current]);

    useEffect(() => {
        setWidth("100%");
        setRenders(0);
    }, [src]);

    return (
        <IframeResizer
            id="recordedIframe-container"
            forwardRef={ref}
            src={src}
            heightCalculationMethod="taggedElement"
            onResized={(e) => {
                console.log(e.height);
                console.log(e.width);
                setWidth(e.width);
                if (e.height > maxHeight && numRenders < 1) {
                    fitToScreen(e.width, e.height);
                }
            }}
            key={key}
            style={{ width, border: "1px solid gray" }}
        />
    )
}