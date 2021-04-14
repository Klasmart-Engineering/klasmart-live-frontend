import {
    activeCameraState,
    activeMicrophoneState,
    activeTabState,
    userState,
    isActiveGlobalScreenshareState,
    isCanvasOpenState,
    isChatOpenState,
    isClassDetailsOpenState,
    isGlobalActionsOpenState,
    isLessonPlanOpenState,
    isPinUserOpenState,
    isViewModesOpenState,
    viewModeState,
} from "../../states/layoutAtoms";
import ToolbarItem from "./toolbarItem";
import ToolbarItemCall from "./toolbarItemCall";
import ToolbarItemCamera from "./toolbarItemCamera";
import ToolbarItemMicrophone from "./toolbarItemMicrophone";
import CanvasMenu from "./toolbarMenus/canvasMenu";
import ChatMenu from "./toolbarMenus/chatMenu";
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
import { UserPin as PinUserIcon } from "@styled-icons/boxicons-regular/UserPin";
import { UserVoice as OnStageIcon } from "@styled-icons/boxicons-solid/UserVoice";
import { Globe as GlobalActionsIcon } from "@styled-icons/entypo/Globe";
import { Info as InfoIcon } from "@styled-icons/evaicons-solid/Info";
import { Eye as ObserveIcon } from "@styled-icons/fa-regular/Eye";
import { PresentationChartBar as PresentIcon } from "@styled-icons/heroicons-solid/PresentationChartBar";
import { ChevronBottom as ViewModesIcon } from "@styled-icons/open-iconic/ChevronBottom";
import { FilePaper as LessonPlanIcon } from "@styled-icons/remix-fill/FilePaper";
import clsx from "clsx";
import React from "react";
import { useRecoilState } from "recoil";

import { useSnackbar } from "kidsloop-px";

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
    const [ activeMicrophone, setActiveMicrophone ] = useRecoilState(activeMicrophoneState);
    const [ activeCamera, setActiveCamera ] = useRecoilState(activeCameraState);

    const [ isGlobalActionsOpen, setIsGlobalActionsOpen ] = useRecoilState(isGlobalActionsOpenState);
    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);
    const [ isViewModesOpen, setIsViewModesOpen ] = useRecoilState(isViewModesOpenState);
    const [ activeTab, setActiveTab ] = useRecoilState(activeTabState);
    const [ isChatOpen, setIsChatOpen ] = useRecoilState(isChatOpenState);
    const [ isClassDetailsOpen, setIsClassDetailsOpen ] = useRecoilState(isClassDetailsOpenState);
    const [ isCanvasOpen, setIsCanvasOpen ] = useRecoilState(isCanvasOpenState);
    const [ viewMode, setViewModeState ] = useRecoilState(viewModeState);

    const [ globalActionsEl, setGlobalActionsEl ] = React.useState<any | null>(null);
    const [ canvasEl, setCanvasEl ] = React.useState<any | null>(null);
    const [ classDetailsEl, setClassDetailsEl ] = React.useState<any | null>(null);
    const [ viewModesEl, setViewModesEl ] = React.useState<any | null>(null);

    const [ chatEl, setChatEl ] = React.useState<any | null>(null);

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
                        icon={<InfoIcon />}
                        label="Class Name"
                        active={isClassDetailsOpen}
                        disabled={Boolean(handleDisabledItem(`classDetails`))}
                        tooltip={handleDisabledItem(`classDetails`)}
                        onClick={(e: Event) => {
                            resetDrawers();
                            setClassDetailsEl(e.currentTarget);
                            setIsClassDetailsOpen(!isClassDetailsOpen);
                        }}
                    />
                    <ToolbarItem
                        icon={<CanvasIcon />}
                        label="Canvas"
                        active={isCanvasOpen}
                        disabled={Boolean(handleDisabledItem(`canvas`))}
                        tooltip={handleDisabledItem(`canvas`)}
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
                        tooltip="Ask permission to leave the class"
                        icon={<PhoneInTalkIcon />}
                    />
                    <ToolbarItemCamera
                        locked={user.isTeacherVideoMuted}
                        active={user.hasVideo}
                        tooltip="The teacher has disabled your camera"
                        onClick={() => setUser({...user, hasVideo: !user.hasVideo})}
                    />
                </Grid>
                <Grid
                    item
                    className={classes.iconGroup}>
                    <ToolbarItem
                        icon={<GlobalActionsIcon />}
                        label="Global actions"
                        disabled={Boolean(handleDisabledItem(`globalActions`))}
                        tooltip={handleDisabledItem(`globalActions`)}
                        active={isGlobalActionsOpen}
                        onClick={(e: Event) => {
                            resetDrawers();
                            setGlobalActionsEl(e.currentTarget);
                            setIsGlobalActionsOpen(!isGlobalActionsOpen);
                        }}
                    />
                    <ToolbarItem
                        icon={<LessonPlanIcon />}
                        label="Lesson Plan"
                        disabled={Boolean(handleDisabledItem(`lessonPlan`))}
                        tooltip={handleDisabledItem(`lessonPlan`)}
                        active={isLessonPlanOpen}
                        onClick={() => {
                            resetDrawers();
                            setIsLessonPlanOpen(!isLessonPlanOpen);
                        }}
                    />
                    <ToolbarItem
                        icon={<ViewModesIcon />}
                        label="View modes"
                        active={isViewModesOpen}
                        badge={viewModesBadge}
                        disabled={Boolean(handleViewModesDisabled())}
                        tooltip={handleViewModesDisabled()}
                        onClick={(e: Event) => {
                            resetDrawers();
                            setViewModesEl(e.currentTarget);
                            setIsViewModesOpen(!isViewModesOpen);
                        }}
                    />

                    <ToolbarItem
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

            {/* <ChatMenu anchor={chatEl} /> */}
            <ClassDetailsMenu anchor={classDetailsEl} />
            <CanvasMenu anchor={canvasEl} />
            <GlobalActionsMenu anchor={globalActionsEl} />
            <ViewModesMenu anchor={viewModesEl} />
        </>
    );
}

export default Toolbar;

function handleViewModesDisabled (){
    const [ isActiveGlobalScreenshare, setIsActiveGlobalScreenshare ] = useRecoilState( isActiveGlobalScreenshareState);
    const [ activeTab, setActiveTab ] = useRecoilState(activeTabState);

    if(isActiveGlobalScreenshare){
        return `View modes are not available when screenshare is active`;
    }

    if(activeTab === `mosaic`){
        return `View modes are not available in mosaic mode`;
    }
}

function handleDisabledItem (item: string){
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
            mosaic: `View modes are not available in mosaic mode`,
        },
    };

    if(activeTab === `mosaic` && tooltips[item]?.mosaic !== undefined){return tooltips[item].mosaic;}

    return(``);
}
