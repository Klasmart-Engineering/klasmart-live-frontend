/* eslint-disable react/no-multi-comp */
import ExitStudy from "./exitStudy/exitStudy";
import PreviewLessonPlan from "./previewLessonPlan";
import { TEXT_COLOR_LIVE_PRIMARY } from "@/config";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    materialActiveIndexState,
    showEndStudyState,
} from "@/store/layoutAtoms";
import { useMediaQuery } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {
    makeStyles,
    Theme,
    useTheme,
} from "@material-ui/core/styles";
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
const ARROW_LARGE_SIZE = `50`;
const ARROW_SMALL_SIZE = `35`;

const useStyles = makeStyles((theme: Theme) => ({
    arrowButton: {
        cursor: `pointer`,
        color: theme.palette.common.white,
    },
    arrowButtonRight: {
        paddingRight: 0,
    },
    arrowButtonLeft: {
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
        borderRadius: theme.spacing(5),
        margin: theme.spacing(0, 2),
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
    } = useSessionContext();

    const classes = useStyles();
    const theme = useTheme();

    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const [ showEndStudy, setShowEndStudy ] = useRecoilState(showEndStudyState);
    const rootDivRef = useRef<HTMLDivElement>(null);
    const [ , setSquareSize ] = useState<number>(0);
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
                <div className={clsx(classes.content, {
                    [classes.contentClass]: classType === ClassType.CLASSES,
                    [classes.mobileWebContent]: isMobileWeb,
                })}
                >
                    <div
                        className={classes.fullHeight}
                        id="activity-view-container"
                    >
                        {showEndStudy ? <ExitStudy /> : <PreviewLessonPlan />}
                    </div>
                </div>
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
    } = props;
    const classes = useStyles();
    const { classType } = useSessionContext();
    const [ showEndStudy ] = useRecoilState(showEndStudyState);
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up(`md`));
    const arrowIconSize = isMdUp ? ARROW_LARGE_SIZE : ARROW_SMALL_SIZE;

    return (
        <div
            className={clsx(classes.arrowButton, {
                [classes.arrowButtonDisabled]: disabled,
                [classes.arrowButtonClass]: classType === ClassType.CLASSES && !showEndStudy,
            })}
            onClick={onClick}
        >
            {direction === `prev` ? <ArrowBackIcon size={arrowIconSize} /> : <ArrowForwardIcon size={arrowIconSize} />}
        </div>
    );
};
