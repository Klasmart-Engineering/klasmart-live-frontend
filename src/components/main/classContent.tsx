import PreviewLessonPlan from "./previewLessonPlan";
import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { useRewardTrophyMutation } from "@/data/live/mutations/useRewardTrophyMutation";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    classEndedState,
    classLeftState,
    materialActiveIndexState,
    showEndStudyState,
} from "@/store/layoutAtoms";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import { ChevronLeft as ArrowBackIcon } from "@styled-icons/boxicons-regular/ChevronLeft";
import { ChevronRight as ArrowForwardIcon } from "@styled-icons/boxicons-regular/ChevronRight";
import { Exit as ExitIcon } from "@styled-icons/icomoon/Exit";
import clsx from "clsx";
import React,
{
    useEffect,
    useRef,
    useState,
} from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import {
    useRecoilState,
    useSetRecoilState,
} from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    arrowButton:{
        cursor: `pointer`,
        borderRadius: 50,
        color: `#fff`,
        background: `#619bd8`,
        boxShadow: `0 10px 15px rgb(97 155 216 / 23%), 0 3px 8px rgb(61 108 156 / 39%)`,
        "&:hover":{
            background: `#4c87c5`,
        },
        "&:active":{
            background: `#bd6dd6`,
        },
        [theme.breakpoints.down(`sm`)]: {
            "& svg":{
                height: `3.5em`,
                width: `3.5em`,
            },
        },
    },
    arrowButtonDisabled:{
        opacity: 0,
        pointerEvents: `none`,
    },
    content:{
        margin: `0 20px`,
        background: theme.palette.background.paper,
        borderRadius: 20,
        height: `100%`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        position: `relative`,
        boxShadow: `0 10px 15px rgb(0 0 0 / 13%), 0 3px 8px rgb(0 0 0 / 13%)`,
        padding: 20,
        boxSizing: `border-box`,
        [theme.breakpoints.down(`sm`)]: {
            padding: 10,
        },
    },
    fullHeight:{
        position: `relative`,
        height: `100%`,
        width: `100%`,
    },
    navigationColumn:{
        width: 70,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        [theme.breakpoints.down(`sm`)]: {
            width: 50,
        },
    },
    centeredContent:{
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
        display: `flex`,
        animation: `$showEndStudyButtons 5000ms ease-in-out`,
    },
    defaultLink:{
        textDecoration: `none`,
        color: `inherit`,
    },
    largeButton:{
        margin: `0 3em`,
        cursor: `pointer`,
        textAlign: `center`,
        [theme.breakpoints.down(`sm`)]: {
            "& svg":{
                height: `3.5em`,
                width: `3.5em`,
            },
        },
    },
    largeButtonIcon:{
        background: `#619bd8`,
        boxShadow: `0 10px 15px rgb(97 155 216 / 23%), 0 3px 8px rgb(61 108 156 / 39%)`,
        padding: 24,
        borderRadius: 80,
        color: `#fff`,
    },
    largeButtonIconYellow:{
        background: `#f7c244`,
        boxShadow: `0 10px 15px rgb(97 155 216 / 23%), 0 3px 8px rgb(61 108 156 / 39%)`,
    },
    largeButtonLabel:{
        fontSize: `1.25em`,
        marginTop: 14,
    },
    "@keyframes showEndStudyButtons": {
        "0%": {
            opacity: 0,
        },
        "50%": {
            opacity: 0,
        },
        "100%": {
            opacity: 1,
        },
    },
}));

export function ClassContent () {
    const {
        classType,
        isTeacher,
        materials,
        sessionId,
        roomId,

    } = useSessionContext();

    const classes = useStyles();
    const intl = useIntl();

    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const [ showEndStudy, setShowEndStudy ] = useRecoilState(showEndStudyState);
    const setClassEnded = useSetRecoilState(classLeftState);
    const setClassLeft = useSetRecoilState(classEndedState);
    const { restart } = useCordovaSystemContext();
    const history = useHistory();
    const { addOnBack } = useCordovaSystemContext();

    const rootDivRef = useRef<HTMLDivElement>(null);
    const [ , setSquareSize ] = useState<number>(0);
    const isStudent = classType === ClassType.STUDY || !isTeacher;
    const HUB_ENDPOINT = process.env.ENDPOINT_HUB;

    const [ rewardTrophyMutation ] = useRewardTrophyMutation();

    const handlePrev = () => {
        setMaterialActiveIndex(materialActiveIndex - 1);
        setShowEndStudy(false);
    };

    const handleNext = () => {
        setMaterialActiveIndex(materialActiveIndex + 1);
        if(materialActiveIndex === materials.length - 1){
            setShowEndStudy(true);
        }
    };

    const onCloseButtonClick = () => {
        setClassEnded(false);
        setClassLeft(false);

        if (restart) {
            restart();
        } else {
            history.push(`/schedule`);
        }
    };

    useEffect(() => {
        const CLASS_CONTENT_BACK_ID = `classContentBackID`;

        addOnBack?.({
            id: CLASS_CONTENT_BACK_ID,
            onBack: onCloseButtonClick,
        });
    }, []);

    useEffect(() => {
        if (!rootDivRef || !rootDivRef.current) { return; }
        const width = rootDivRef.current.clientWidth;
        const height = rootDivRef.current.clientHeight;
        if (!width || !height) { return; }
        else if (width > height) { setSquareSize(height); }
        else { setSquareSize(width); }
    }, [ rootDivRef.current ]);

    useEffect(() => {
        if(showEndStudy){
            rewardTrophyMutation({
                variables: {
                    roomId,
                    user: `local-${sessionId}`,
                    kind: `great_job`,
                },
            });
        }
    }, [ showEndStudy ]);

    return(
        <Grid
            container
            className={classes.fullHeight}>
            <Grid
                item
                className={classes.navigationColumn}>
                <MaterialNavigation
                    direction="prev"
                    disabled={materialActiveIndex <= 0}
                    onClick={() => handlePrev()} />
            </Grid>
            <Grid
                item
                xs>
                {showEndStudy ?
                    <div className={classes.centeredContent}>
                        {
                            (process.env.IS_CORDOVA_BUILD)
                                ?   <a
                                    className={classes.defaultLink}
                                    onClick={onCloseButtonClick}>
                                    <LargeButton
                                        icon={<ExitIcon size="5em" />}
                                        label={intl.formatMessage({
                                            id: `end_study_exit`,
                                        })}
                                    />
                                </a>
                                :   <a
                                    href={HUB_ENDPOINT}
                                    className={classes.defaultLink}>
                                    <LargeButton
                                        icon={<ExitIcon size="5em" />}
                                        label={intl.formatMessage({
                                            id: `end_study_exit`,
                                        })}
                                    />
                                </a>
                        }
                        {/* TODO : Bonus content
                            <LargeButton
                            icon={<BonusContentIcon size="5em" />}
                            variant="yellow"
                            label={intl.formatMessage({
                                id: `end_study_bonus_content`,
                            })}/> */}
                    </div> :
                    <div className={classes.content}>
                        <div className={classes.fullHeight}>
                            <PreviewLessonPlan />
                        </div>
                    </div> }
            </Grid>
            <Grid
                item
                className={classes.navigationColumn}>
                <MaterialNavigation
                    direction="next"
                    disabled={materialActiveIndex >=  materials.length}
                    onClick={() => handleNext()}/>
            </Grid>
        </Grid>
    );
}

export interface MaterialNavigationProps {
    direction: "prev" | "next";
    disabled?: boolean;
    onClick?: any;
}

const MaterialNavigation = (props:MaterialNavigationProps) => {
    const {
        direction,
        disabled,
        onClick,

    } = props;
    const classes = useStyles();

    return (
        <div
            className={clsx(classes.arrowButton, {
                [classes.arrowButtonDisabled]: disabled,
            })}
            onClick={onClick}>
            {direction === `prev` ? <ArrowBackIcon size="5em" /> : <ArrowForwardIcon size="5em" />}
        </div>
    );
};

export interface LargeButtonProps {
    icon: any;
    variant?: "blue" | "yellow";
    label?: string;
    onClick?: any;
}

const LargeButton = (props:LargeButtonProps) => {
    const {
        variant,
        label,
        onClick,
        icon,

    } = props;
    const classes = useStyles();

    return (
        <div
            className={classes.largeButton}
            onClick={onClick}>
            <div className={clsx(classes.largeButtonIcon, {
                [classes.largeButtonIconYellow] : variant === `yellow`,
            })}>{icon}</div>
            <Typography className={classes.largeButtonLabel}>{label}</Typography>
        </div>
    );
};
