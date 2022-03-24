import ExitStudy from "./exitStudy/exitStudy";
import PreviewLessonPlan from "./previewLessonPlan";
import { useRewardTrophyMutation } from "@/data/live/mutations/useRewardTrophyMutation";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    materialActiveIndexState,
    showEndStudyState,
} from "@/store/layoutAtoms";
import Grid from "@material-ui/core/Grid";
import {
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import { ChevronLeft as ArrowBackIcon } from "@styled-icons/entypo/ChevronLeft";
import { ChevronRight as ArrowForwardIcon } from "@styled-icons/entypo/ChevronRight";
import { Exit as ExitIcon } from "@styled-icons/icomoon/Exit";
import clsx from "clsx";
import React,
{
    useEffect,
    useRef,
    useState,
} from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    arrowButtonStudy: {
        cursor: `pointer`,
        color: theme.palette.common.white,
    },
    arrowButton: {
        borderRadius: 50,
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
    arrowButtonRight: {
        paddingRight: theme.spacing(5),
    },
    arrowButtonDisabled:{
        opacity: 0,
        pointerEvents: `none`,
    },
    content:{
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
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    centeredContent:{
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
        display: `flex`,
        animation: `$showEndStudyButtons 5000ms ease-in-out`,
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
    navigationColumnActions: {
        marginLeft: theme.spacing(2.5),
    },
    contentClass: {
        margin: theme.spacing(0, 2.5),
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

    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const [ showEndStudy, setShowEndStudy ] = useRecoilState(showEndStudyState);
    const rootDivRef = useRef<HTMLDivElement>(null);
    const [ , setSquareSize ] = useState<number>(0);
    const forStudent = classType === ClassType.STUDY || !isTeacher;
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
            wrap="nowrap"
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
                        <ExitStudy />
                    </div> :
                    <div className={clsx(classes.content, {
                        [classes.contentClass]: classType === ClassType.CLASSES,
                    })}>
                        <div
                            className={classes.fullHeight}
                            id="activity-view-container">
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
    const { classType } = useSessionContext();

    return (
        <div
            className={clsx(classes.arrowButtonStudy, {
                [classes.arrowButtonDisabled]: disabled,
                [classes.arrowButton]: classType !== ClassType.STUDY,
                [classes.arrowButtonRight]: direction === `next` && classType === ClassType.STUDY,
            })}
            onClick={onClick}>
            {direction === `prev` ? <ArrowBackIcon size="5em" /> : <ArrowForwardIcon size="5em" />}
        </div>
    );
};
