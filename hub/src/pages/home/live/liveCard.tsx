import { v4 as uuid } from "uuid";
const classId = uuid().substr(0, 5);
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Menu, { MenuProps } from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme, useTheme, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useStore } from "react-redux";

import LiveBackground from "../../../assets/img/live_bg.svg";
import CenterAlignChildren from "../../../components/centerAlignChildren";
import StyledFAB from "../../../components/styled/fabButton";
import StyledTextField from "../../../components/styled/textfield";

const DEMO_LESSON_PLANS = [
    {
        id: "demo-lesson-plan01", title: "Badanamu Zoo: Snow Leopard"
    }
];

const DEMO_LESSON_MATERIALS = [
    { name: "Introduction", url: "/h5p/play/5ed99fe36aad833ac89a4803" },
    { name: "Sticker Activity", url: "/h5p/play/5ed0b64a611e18398f7380fb" },
    { name: "Hotspot Cat Family 1", url: "/h5p/play/5ecf6f43611e18398f7380f0" },
    { name: "Hotspot Cat Family 2", url: "/h5p/play/5ed0a79d611e18398f7380f7" },
    { name: "Snow Leopard Camouflage 1", url: "/h5p/play/5ecf71d2611e18398f7380f2" },
    { name: "Snow Leopard Camouflage 2", url: "/h5p/play/5ed0a79d611e18398f7380f7" },
    { name: "Snow Leopard Camouflage 3", url: "/h5p/play/5ed0a7d6611e18398f7380f8" },
    { name: "Snow Leopard Camouflage 4", url: "/h5p/play/5ed0a7f8611e18398f7380f9" },
    { name: "Snow Leopard Camouflage 5", url: "/h5p/play/5ed0a823611e18398f7380fa" },
    { name: "Matching", url: "/h5p/play/5ecf4e4b611e18398f7380ef" },
    { name: "Quiz", url: "/h5p/play/5ed07656611e18398f7380f6" },
];

interface LessonPlanData {
    id: string;
    title: string;
    data?: any;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        classInfoContainer: {
            background: `url(${LiveBackground}) no-repeat`,
            backgroundColor: "#f0e6cf",
            backgroundPosition: "center right",
            backgroundSize: "30%",
            borderRadius: 12,
            color: "#193d6f",
            height: "100%",
            minHeight: 440,
            padding: theme.spacing(4, 5),
            [theme.breakpoints.down("sm")]: {
                backgroundPosition: "bottom right",
                height: `min(${window.innerHeight - 20}px,56vw)`,
                padding: theme.spacing(2, 2),
            },
            [theme.breakpoints.down("xs")]: {
                height: `min(${window.innerHeight - 20}px,72vw)`,
            },
        },
        liveButton: {
            backgroundColor: "#ff6961",
            color: "white",
            marginRight: theme.spacing(2),
        },
        liveTextWrapper: {
            backgroundColor: "#ff6961",
            borderRadius: 20,
            color: "white",
            fontSize: "0.6em",
            padding: theme.spacing(0.25, 0.75),
        },
        select: {
            display: "block",
        },
    }),
);

export default function LiveCard() {
    const classes = useStyles();
    const theme = useTheme();
    const store = useStore();

    const [userType, setUserType] = useState("teacher");
    const [className, setClassName] = useState(classId);
    const [userName, setUserName] = useState("");
    const [lessonPlan, setLessonPlan] = useState<LessonPlanData>({ id: "", title: "" });
    const [lessonPlans, setLessonPlans] = useState<LessonPlanData[]>([]);

    // async function fetchPublishedLessonPlans() {
    //     const headers = new Headers();
    //     headers.append("Accept", "application/json");
    //     headers.append("Content-Type", "application/json");
    //     const response = await fetch(`/v1/contents?publish_status=published&content_type=2`, {
    //         headers,
    //         method: "GET"
    //     })
    //     if (response.status === 200) { return response.json(); }
    // }

    // useEffect(() => {
    //     let prepared = true;
    //     (async () => {
    //         const json = await fetchPublishedLessonPlans();
    //         if (prepared) {
    //             if (json && json.list) {
    //                 // console.log("json: ", json, json.list)
    //                 const lpList = json.list.map((lp: any) => {
    //                     return { id: lp.id, title: lp.name, data: lp.data };
    //                 });
    //                 setLessonPlans(lpList);
    //             } else {
    //                 setLessonPlans(DEMO_LESSON_PLANS);
    //             }
    //         }
    //     })();
    //     return () => { prepared = false; };
    // }, []);

    useEffect(() => {
        // console.log("selected lp: ", lessonPlan)
        // console.log("selected metarials: ", lessonPlan.data)
    }, [lessonPlan]);

    useEffect(() => {
        if (userType === "student") { setClassName(""); }
        if (userType === "teacher") { setClassName(classId); }
    }, [userType]);

    function goLive() {
        let params = `name=${userName}&roomId=${className}`;
        if (userType === "teacher") {
            params += `&teacher&materials=${JSON.stringify(DEMO_LESSON_MATERIALS)}`;
        }
        const liveLink = `https://live.kidsloop.net/live/?${params}`;

        window.open(liveLink);
    }

    return (
        <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="flex-start"
            wrap="nowrap"
            className={classes.classInfoContainer}
        >
            <Grid item>
                <Grid container item spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4">Welcome to KidsLoop</Typography>
                    </Grid>
                    <Grid container direction="row" alignItems="center" item xs={12}>
                        <StyledTextField
                            disabled={userType === "teacher"}
                            id="class-name-input"
                            label={<FormattedMessage id={"live_classNameLabel"} />}
                            onChange={(e) => setClassName(e.target.value)}
                            value={className}
                        />
                        {userType === "teacher" ? null :
                            <Tooltip arrow placement="right" title="Please enter the 5-character class name from your teacher">
                                <InfoIcon fontSize="small" style={{ marginLeft: 12 }} />
                            </Tooltip>
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTextField
                            id="user-name-input"
                            label={<FormattedMessage id={"live_userNameLabel"} />}
                            onChange={(e) => setUserName(e.target.value)}
                            value={userName}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <RadioGroup
                            aria-label="type of user"
                            defaultValue={"student"}
                            name="Type of User"
                            onChange={(e) => setUserType((e.target as HTMLInputElement).value)}
                            value={userType}
                            row
                        >
                            <FormControlLabel
                                value="teacher"
                                control={<Radio color="primary" style={{ backgroundColor: "transparent" }} />}
                                label="Teacher"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="student"
                                control={<Radio color="primary" style={{ backgroundColor: "transparent" }} />}
                                label="Student"
                                labelPlacement="end"
                            />
                        </RadioGroup>
                    </Grid>
                    {userType === "teacher" ?
                        <Grid item xs={12}>
                            <CenterAlignChildren>
                                <Typography variant="h6" style={{ paddingRight: theme.spacing(2) }}>
                                    <FormattedMessage id={"live_lessonPlanLabel"} />:
                                </Typography>
                                <LessonPlanSelect lessonPlans={lessonPlans} lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
                            </CenterAlignChildren>
                        </Grid>
                        : null}
                </Grid>
            </Grid>
            <Grid item>
                <CenterAlignChildren>
                    <StyledFAB
                        disabled={className === "" || userName === "" || (userType === "teacher" && lessonPlan.id === "")}
                        extendedOnly
                        flat
                        className={classes.liveButton}
                        onClick={() => goLive()}>
                        <FormattedMessage id="live_liveButton" />
                    </StyledFAB>
                </CenterAlignChildren>
            </Grid>
        </Grid>
    );
}

interface ClassInfo {
    classId: string;
    className: string;
}

const CLASS_LIST: ClassInfo[] = [
    {
        classId: "CalmIsland",
        className: "Pre-production",
    },
];

const StyledMenu = withStyles({})((props: MenuProps) => (
    <Menu
        elevation={4}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
        {...props}
    />
));

// function ClassSelect() {
//     const classes = useStyles();
//     const store = useStore();

//     const liveData = useSelector((state: State) => state.account.finishLiveData);
//     const classInfo = CLASS_LIST.find((element) => element.classId === liveData.classId);
//     const [className, setClassName] = useState<string>(classInfo ? classInfo.className : "");
//     const [classNameMenuElement, setClassNameMenuElement] = useState<null | HTMLElement>(null);

//     function classSelect(classInfo: ClassInfo) {
//         const value = {
//             classId: classInfo.classId,
//             className: classInfo.className,
//             startDate: liveData.students,
//             students: liveData.students,
//         };
//         store.dispatch({ type: ActionTypes.FINISH_LIVE_DATA, payload: value });
//         setClassName(classInfo.className);
//     }

//     return (
//         <>
//             <Tooltip title={<FormattedMessage id="live_classSelect" />} enterDelay={300}>
//                 <Button
//                     color="inherit"
//                     aria-owns={classNameMenuElement ? "classSelect-menu" : undefined}
//                     aria-haspopup="true"
//                     data-ga-event-category="AppBar"
//                     data-ga-event-action="classSelect"
//                     onClick={(e) => setClassNameMenuElement(e.currentTarget)}
//                 >
//                     <span className={classes.select}>
//                         {liveData.classId === "" ?
//                             <FormattedMessage id="live_classSelect" /> :
//                             className
//                         }
//                     </span>
//                     <ExpandMoreIcon fontSize="small" />
//                 </Button>
//             </Tooltip>
//             <StyledMenu
//                 id="classSelect-menu"
//                 anchorEl={classNameMenuElement}
//                 keepMounted
//                 open={Boolean(classNameMenuElement)}
//                 onClose={() => setClassNameMenuElement(null)}
//             >
//                 {
//                     CLASS_LIST.map((classInfo) => (
//                         <MenuItem
//                             key={classInfo.classId}
//                             selected={liveData.classId === classInfo.classId}
//                             onClick={() => classSelect(classInfo)}
//                         >
//                             {classInfo.className}
//                         </MenuItem>
//                     ))
//                 }
//             </StyledMenu>
//         </>
//     );
// }

function LessonPlanSelect({ lessonPlans, lessonPlan, setLessonPlan }: {
    lessonPlans: LessonPlanData[],
    lessonPlan: LessonPlanData,
    setLessonPlan: React.Dispatch<React.SetStateAction<LessonPlanData>>
}) {
    const classes = useStyles();

    const [lessonPlanOptions, _] = useState<Array<{ id: string, title: string }>>(DEMO_LESSON_PLANS);
    const [lessonPlanMenuElement, setLessonPlanMenuElement] = useState<null | HTMLElement>(null);

    return (
        <>
            <Tooltip title={<FormattedMessage id="live_lessonPlanSelect" />} enterDelay={300}>
                <Button
                    color="inherit"
                    aria-owns={lessonPlanMenuElement ? "lesson-plan-select-menu" : undefined}
                    aria-haspopup="true"
                    data-ga-event-category="AppBar"
                    data-ga-event-action="lesson-plan-select"
                    onClick={(e) => setLessonPlanMenuElement(e.currentTarget)}
                >
                    <span className={classes.select}>
                        {lessonPlan.title === ""
                            ? <FormattedMessage id="live_lessonPlanSelect" />
                            : lessonPlan.title
                        }
                    </span>
                    <ExpandMoreIcon fontSize="small" />
                </Button>
            </Tooltip>
            <StyledMenu
                id="lesson-plan-select-menu"
                anchorEl={lessonPlanMenuElement}
                keepMounted
                open={Boolean(lessonPlanMenuElement)}
                onClose={() => setLessonPlanMenuElement(null)}
            >
                {
                    lessonPlanOptions.map((lp) => (
                        <MenuItem
                            key={lp.id}
                            selected={lessonPlan.id === lp.id}
                            onClick={() => setLessonPlan(lp)}
                        >
                            {lp.title}
                        </MenuItem>
                    ))
                }
            </StyledMenu>
        </>
    );
}
