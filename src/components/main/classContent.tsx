/* eslint-disable react/no-multi-comp */
import ExitStudy from "./exitStudy/exitStudy";
import PreviewLessonPlan from "./previewLessonPlan";
import { TEXT_COLOR_LIVE_PRIMARY } from "@/config";
import { useRewardTrophyMutation } from "@/data/live/mutations/useRewardTrophyMutation";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    materialActiveIndexState,
    showEndStudyState,
} from "@/store/layoutAtoms";
import {
    Grid,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { ChevronLeft as ArrowBackIcon } from "@styled-icons/entypo/ChevronLeft";
import { ChevronRight as ArrowForwardIcon } from "@styled-icons/entypo/ChevronRight";
import clsx from "clsx";
import React,
{
    useEffect,
    useRef,
    useState,
} from "react";
import { useRecoilState } from "recoil";

const ARROW_SIZE = 120;

const useStyles = makeStyles((theme) => ({
    arrowButton: {
        cursor: `pointer`,
        color: theme.palette.common.white,
    },
    arrowButtonRight: {
        paddingRight: theme.spacing(5),
    },
    arrowButtonDisabled: {
        opacity: 0,
        pointerEvents: `none`,
    },
    arrowButtonClass: {
        color: TEXT_COLOR_LIVE_PRIMARY,
    },
    content: {
        background: theme.palette.background.paper,
        borderRadius: theme.spacing(2.5),
        height: `100%`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        position: `relative`,
        boxShadow: `0 10px 15px rgb(0 0 0 / 13%), 0 3px 8px rgb(0 0 0 / 13%)`,
        padding: theme.spacing(2.5),
        boxSizing: `border-box`,
        [theme.breakpoints.down(`sm`)]: {
            padding: theme.spacing(1.25),
        },
    },
    fullHeight: {
        position: `relative`,
        height: `100%`,
        width: `100%`,
    },
    navigationColumn: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    centeredContent: {
        height: `100%`,
        alignItems: `center`,
        justifyContent: `center`,
        display: `flex`,
        animation: `$showEndStudyButtons 5000ms ease-in-out`,
    },
    mobileWebNavigationArrows: {
        flex: `auto`,
        maxHeight: ARROW_SIZE,
        width: ARROW_SIZE,
    },
    orderTwo: {
        order: 2,
    },
    orderThree: {
        order: 3,
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
    mobileWebContent: {
        borderRadius: 0,
        margin: 0,
        padding: 0,
        boxShadow: `none`,
    },
}));

export function ClassContent () {
    const {
        classType,
        materials,
        sessionId,
        roomId,
    } = useSessionContext();

    const classes = useStyles();
    const theme = useTheme();

    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const [ showEndStudy, setShowEndStudy ] = useRecoilState(showEndStudyState);
    const rootDivRef = useRef<HTMLDivElement>(null);
    const [ , setSquareSize ] = useState<number>(0);
    const [ rewardTrophyMutation ] = useRewardTrophyMutation();
    const isXsDown = useMediaQuery(theme.breakpoints.down(`xs`));
    const isMobileWeb = !process.env.IS_CORDOVA_BUILD && isXsDown;

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
            wrap={isMobileWeb ? `wrap` : `nowrap`}
            className={classes.fullHeight}
        >
            <Grid
                item
                className={clsx(classes.navigationColumn, isMobileWeb && ([ classes.mobileWebNavigationArrows, classes.orderTwo ]) )}
            >
                <MaterialNavigation
                    direction="prev"
                    disabled={materialActiveIndex <= 0}
                    onClick={() => handlePrev()}
                />
            </Grid>

            <Grid
                item
                xs={12}
            >
                {showEndStudy ? (
                    <div className={classes.centeredContent}>
                        <ExitStudy />
                    </div> ) : (
                    <div className={clsx(classes.content, {
                        [classes.contentClass]: classType === ClassType.CLASSES,
                        [classes.mobileWebContent]: isMobileWeb,
                    })}
                    >
                        <div
                            className={classes.fullHeight}
                            id="activity-view-container"
                        >
                            <PreviewLessonPlan />
                        </div>
                    </div>
                )}
            </Grid>
            <Grid
                item
                className={clsx(classes.navigationColumn, isMobileWeb && ([ classes.mobileWebNavigationArrows, classes.orderThree ]) )}
            >
                <MaterialNavigation
                    direction="next"
                    disabled={materialActiveIndex >= materials.length}
                    isMobileWeb={isMobileWeb}
                    onClick={() => handleNext()}
                />
            </Grid>
        </Grid>
    );
}

export interface MaterialNavigationProps {
    direction: "prev" | "next";
    disabled?: boolean;
    onClick?: any;
    isMobileWeb?: boolean;
}

const MaterialNavigation = (props: MaterialNavigationProps) => {
    const {
        direction,
        disabled,
        onClick,
        isMobileWeb,
    } = props;
    const classes = useStyles();
    const { classType } = useSessionContext();
    const [ showEndStudy ] = useRecoilState(showEndStudyState);

    return (
        <div
            className={clsx(classes.arrowButton, {
                [classes.arrowButtonDisabled]: disabled,
                [classes.arrowButtonRight]: direction === `next` && classType === ClassType.STUDY && !isMobileWeb,
                [classes.arrowButtonClass]: classType === ClassType.CLASSES && !showEndStudy,
            })}
            onClick={onClick}
        >
            {direction === `prev` ? <ArrowBackIcon size="5em" /> : <ArrowForwardIcon size="5em" />}
        </div>
    );
};
