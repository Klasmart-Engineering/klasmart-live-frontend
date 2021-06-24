import { ClassType } from "../../../store/actions";
import { LIVE_LINK, LocalSessionContext } from "../../providers/providers";
import {
    materialActiveIndexState, showEndStudyState, studyRecommandUrlState,
} from "../../states/layoutAtoms";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import { MUTATION_REWARD_TROPHY } from "../utils/graphql";
import PreviewLessonPlan from "./previewLessonPlan";
import { WB_TOOLBAR_MAX_HEIGHT } from "./WBToolbar";
import { useMutation } from "@apollo/client";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { StarFill as BonusContentIcon } from "@styled-icons/bootstrap/StarFill";
import { ChevronLeft as ArrowBackIcon } from "@styled-icons/boxicons-regular/ChevronLeft";
import { ChevronRight as ArrowForwardIcon } from "@styled-icons/boxicons-regular/ChevronRight";
import { Exit as ExitIcon } from "@styled-icons/icomoon/Exit";
import clsx from "clsx";
import React, {
    useContext, useEffect, useRef, useState,
} from "react";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";

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
    },
    fullHeight:{
        position: `relative`,
        height: `100%`,
        width: `100%`,
    },
    navigationColumn:{
        width: `15vw`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        [theme.breakpoints.down(`sm`)]: {
            width: 80,
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
        classtype, isTeacher, materials, sessionId, roomId,
    } = useContext(LocalSessionContext);

    const classes = useStyles();
    const intl = useIntl();

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [ materialActiveIndex, setMaterialActiveIndex ] = useRecoilState(materialActiveIndexState);
    const [ studyRecommandUrl, setStudyRecommandUrl ] = useRecoilState(studyRecommandUrlState);
    const [ showEndStudy, setShowEndStudy ] = useRecoilState(showEndStudyState);

    const materialsLength = studyRecommandUrl ? materials.length + 1 : materials.length;

    const rootDivRef = useRef<HTMLDivElement>(null);
    const [ squareSize, setSquareSize ] = useState<number>(0);
    const forStudent = classtype === ClassType.STUDY || !isTeacher;
    const HUB_ENDPOINT = process.env.ENDPOINT_HUB;

    const [ rewardTrophyMutation, { loading: loadingTrophy } ] = useMutation(MUTATION_REWARD_TROPHY, {
        context: {
            target: LIVE_LINK,
        },
    });

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
            style={{
                height: `calc(100% - ${WB_TOOLBAR_MAX_HEIGHT}px)`,
            }}>
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
                        <a
                            href={HUB_ENDPOINT}
                            className={classes.defaultLink}>
                            <LargeButton
                                icon={<ExitIcon size="5em" />}
                                label={intl.formatMessage({
                                    id: `end_study_exit`,
                                })}
                            />
                        </a>

                        {/* TODO : Bonus content
                            <LargeButton
                            icon={<BonusContentIcon size="5em" />}
                            variant="yellow"
                            label={intl.formatMessage({
                                id: `end_study_bonus_content`,
                            })}/> */}
                    </div> :
                    <div className={classes.content}>
                        <div
                            className={classes.fullHeight}
                            id="activity-view-container">
                            <Whiteboard
                                uniqueId={forStudent ? `student` : `teacher`}
                                group={sessionId} />
                            <PreviewLessonPlan />
                        </div>
                    </div> }
            </Grid>
            <Grid
                item
                className={classes.navigationColumn}>
                <MaterialNavigation
                    direction="next"
                    disabled={materialActiveIndex >=  materialsLength}
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
        direction, disabled, onClick,
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
        variant, label, onClick, icon,
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
