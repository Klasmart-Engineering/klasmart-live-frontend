import {
    activeTabState,
    userState,
    isActiveGlobalScreenshareState,
    isCanvasOpenState,
    isChatOpenState,
    isClassDetailsOpenState,
    isGlobalActionsOpenState,
    isLessonPlanOpenState,
    isViewModesOpenState,
    viewModeState,
} from "../../states/layoutAtoms";
import ToolbarItem from "./toolbarItem";
import ToolbarItemCall from "./toolbarItemCall";
import ToolbarItemCamera from "./toolbarItemCamera";
import ToolbarItemMicrophone from "./toolbarItemMicrophone";
import CanvasMenu from "./toolbarMenus/canvasMenu";
import ClassDetailsMenu from "./toolbarMenus/classDetailsMenu/index";
import GlobalActionsMenu from "./toolbarMenus/globalActionsMenu";
import ViewModesMenu from "./toolbarMenus/viewModesMenu";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import PhoneInTalkIcon from "@material-ui/icons/PhoneInTalk";
import { ChatSquareDotsFill as ChatIcon } from "@styled-icons/bootstrap/ChatSquareDotsFill";
import { PencilFill as CanvasIcon } from "@styled-icons/bootstrap/PencilFill";
import { UserVoice as OnStageIcon } from "@styled-icons/boxicons-solid/UserVoice";
import { Globe as GlobalActionsIcon } from "@styled-icons/entypo/Globe";
import { Info as InfoIcon } from "@styled-icons/evaicons-solid/Info";
import { Eye as ObserveIcon } from "@styled-icons/fa-regular/Eye";
import { PresentationChartBar as PresentIcon } from "@styled-icons/heroicons-solid/PresentationChartBar";
import { ChevronBottom as ViewModesIcon } from "@styled-icons/open-iconic/ChevronBottom";
import { FilePaper as LessonPlanIcon } from "@styled-icons/remix-fill/FilePaper";
import clsx from "clsx";
import React, { useState } from "react";
import { useRecoilState } from "recoil";

import { useSnackbar } from "kidsloop-px";
import { DialogEndCall } from "../utils/endCall/endCall";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 10,
        marginTop: -10,
        justifyContent: `space-between`,
        color: theme.palette.text.primary,
        position: 'relative',
        zIndex: 9
    },
    rootMosaic:{
        backgroundColor: `rgba(49,49,60,0.85)`,
        color: `#fff`,
        paddingLeft: 40,
        paddingRight: 40,
    },
    iconGroup: {
        display: `flex`,
        alignItems: `center`,
        margin: `0 -4px`,
    },
}));

function Toolbar () {
    const classes = useStyles();

    const [ user, setUser ] = useRecoilState(userState);
    const [ isGlobalActionsOpen, setIsGlobalActionsOpen ] = useRecoilState(isGlobalActionsOpenState);
    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);
    const [ isViewModesOpen, setIsViewModesOpen ] = useRecoilState(isViewModesOpenState);
    const [ activeTab, setActiveTab ] = useRecoilState(activeTabState);
    const [ isChatOpen, setIsChatOpen ] = useRecoilState(isChatOpenState);
    const [ isClassDetailsOpen, setIsClassDetailsOpen ] = useRecoilState(isClassDetailsOpenState);
    const [ isCanvasOpen, setIsCanvasOpen ] = useRecoilState(isCanvasOpenState);
    const [ viewMode, setViewModeState ] = useRecoilState(viewModeState);

    const [ globalActionsEl, setGlobalActionsEl ] = useState<any | null>(null);
    const [ canvasEl, setCanvasEl ] = useState<any | null>(null);
    const [ classDetailsEl, setClassDetailsEl ] = useState<any | null>(null);
    const [ viewModesEl, setViewModesEl ] = useState<any | null>(null);
    const [ chatEl, setChatEl ] = useState<any | null>(null);

    const [openEndCallDialog, setOpenEndCallDialog] = useState(false);

    const resetDrawers = () => {
        setIsGlobalActionsOpen(false);
        setIsLessonPlanOpen(false);
        setIsChatOpen(false);
        setIsClassDetailsOpen(false);
        setIsCanvasOpen(false);
        setIsGlobalActionsOpen(false);
        setIsViewModesOpen(false);
    };

    const { enqueueSnackbar } = useSnackbar();

    let viewModesBadge = <OnStageIcon />;
    switch (viewMode) {
    case `onstage`:
        viewModesBadge = <OnStageIcon />;
        break;
    case `observe`:
        viewModesBadge = <ObserveIcon />;
        break;
    case `present`:
        viewModesBadge = <PresentIcon />;
        break;
    }

    return (
        <>
            <Grid
                container
                className={clsx(classes.root, {
                    [classes.rootMosaic] : activeTab === `mosaic`,
                })}>
                <Grid
                    item
                    className={classes.iconGroup}>
                    <ToolbarItem
                        display={true}
                        icon={<InfoIcon />}
                        label="Class Name"
                        active={isClassDetailsOpen}
                        disabled={Boolean(handleTooltip(`classDetails`))}
                        tooltip={handleTooltip(`classDetails`)}
                        onClick={(e: Event) => {
                            resetDrawers();
                            setClassDetailsEl(e.currentTarget);
                            setIsClassDetailsOpen(!isClassDetailsOpen);
                        }}
                    />
                    <ToolbarItem
                        display={user.hasControls}
                        icon={<CanvasIcon />}
                        label="Canvas"
                        active={isCanvasOpen}
                        disabled={Boolean(handleTooltip(`canvas`))}
                        tooltip={handleTooltip(`canvas`)}
                        onClick={(e: Event) => {
                            resetDrawers();
                            setCanvasEl(e.currentTarget);
                            setIsCanvasOpen(!isCanvasOpen);
                        }}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.iconGroup}>
                    <ToolbarItemMicrophone
                        locked={user.isTeacherAudioMuted}
                        active={user.hasAudio}
                        onClick={() =>  {enqueueSnackbar('mic muted'); setUser({...user, hasAudio: !user.hasAudio})}}
                    />
                    <ToolbarItemCall
                        locked={user.role === 'student'}
                        tooltip={user.role === 'student' ? "Ask permission to leave the class" : undefined}
                        icon={<PhoneInTalkIcon />}
                        onClick={() => setOpenEndCallDialog(true)}
                    />
                    <ToolbarItemCamera
                        locked={user.isTeacherVideoMuted}
                        active={user.hasVideo}
                        tooltip={user.isTeacherVideoMuted ? "The teacher has disabled your camera" : undefined}
                        onClick={() => setUser({...user, hasVideo: !user.hasVideo})}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.iconGroup}>
                    <ToolbarItem
                        display={user.hasControls}
                        icon={<GlobalActionsIcon />}
                        label="Global actions"
                        disabled={Boolean(handleTooltip(`globalActions`))}
                        tooltip={handleTooltip(`globalActions`)}
                        active={isGlobalActionsOpen}
                        onClick={(e: Event) => {
                            resetDrawers();
                            setGlobalActionsEl(e.currentTarget);
                            setIsGlobalActionsOpen(!isGlobalActionsOpen);
                        }}
                    />
                    <ToolbarItem
                        display={user.hasControls}
                        icon={<LessonPlanIcon />}
                        label="Lesson Plan"
                        disabled={Boolean(handleTooltip(`lessonPlan`))}
                        tooltip={handleTooltip(`lessonPlan`)}
                        active={isLessonPlanOpen}
                        onClick={() => {
                            resetDrawers();
                            setIsLessonPlanOpen(!isLessonPlanOpen);
                        }}
                    />
                    <ToolbarItem
                        display={user.hasControls}
                        icon={<ViewModesIcon />}
                        label="View modes"
                        active={isViewModesOpen}
                        badge={viewModesBadge}
                        disabled={Boolean(handleTooltip(`viewModes`))}
                        tooltip={handleTooltip(`viewModes`)}
                        onClick={(e: Event) => {
                            resetDrawers();
                            setViewModesEl(e.currentTarget);
                            setIsViewModesOpen(!isViewModesOpen);
                        }}
                    />

                    <ToolbarItem
                        display={true}
                        icon={<ChatIcon />}
                        label="Chat"
                        badge={2}
                        active={isChatOpen}
                        onClick={(e: Event) => {
                            resetDrawers();
                            setChatEl(e.currentTarget);
                            setIsChatOpen(!isChatOpen);
                        }}
                    />
                </Grid>
            </Grid>

            <ClassDetailsMenu anchor={classDetailsEl} />
            <CanvasMenu anchor={canvasEl} />
            <GlobalActionsMenu anchor={globalActionsEl} />
            <ViewModesMenu anchor={viewModesEl} />

            <DialogEndCall user={user} open={openEndCallDialog} onClose={() => setOpenEndCallDialog(false)} /> 
        </>
    );
}

export default Toolbar;



function handleTooltip (item: string){
    const [ isActiveGlobalScreenshare, setIsActiveGlobalScreenshare ] = useRecoilState( isActiveGlobalScreenshareState);
    const [ activeTab, setActiveTab ] = useRecoilState(activeTabState);

    const tooltips:any = {
        classDetails: {
            mosaic: `Class details are not available in mosaic mode`,
        },
        canvas: {
            mosaic: `Canvas is not available in mosaic mode`,
        },
        lessonPlan: {
            mosaic: `Lesson plan is not available in mosaic mode`,
        },
        viewModes: {
            screenshare: `View modes are not available when screenshare is active`,
            mosaic: `View modes are not available in mosaic mode`,
        },
    };

    if(isActiveGlobalScreenshare && tooltips[item]?.screenshare !== undefined){return tooltips[item].screenshare}
    
    if(activeTab === `mosaic` && tooltips[item]?.mosaic !== undefined){return tooltips[item].mosaic;}

    return(``);
}
