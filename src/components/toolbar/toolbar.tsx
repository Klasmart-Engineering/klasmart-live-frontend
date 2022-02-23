import {
    DialogEndClass,
    DialogLeaveClass,
} from "./endCall/endCall";
import ToolbarItem from "./toolbarItem";
import ToolbarItemCall from "./toolbarItemCall";
import ToolbarItemCamera from "./toolbarItemCamera";
import ToolbarItemMicrophone from "./toolbarItemMicrophone";
import CanvasMenu from "./toolbarMenus/canvasMenu/canvasMenu";
import ChatMenu from "./toolbarMenus/chatMenu/chatMenu";
import ClassDetailsMenu from "./toolbarMenus/classDetailsMenu/classDetailsMenu";
import GlobalActionsMenu from "./toolbarMenus/globalActionsMenu/globalActionsMenu";
import LessonPlanMenu from "./toolbarMenus/lessonPlanMenu/lessonPlanMenu";
import ViewModesMenu from "./toolbarMenus/viewModesMenu/viewModesMenu";
import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import useCordovaObservePause from "@/app/platform/cordova-observe-pause";
import LeaveClassIcon from "@/assets/img/icon_leave_class.svg";
import { useMuteMutation } from "@/data/sfu/mutations/useMuteMutation";
import { LIVE_ON_BACK_ID } from "@/pages/room/room-with-context";
import { InteractiveMode } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import {
    MuteNotification,
    WebRTCContext,
} from "@/providers/WebRTCContext";
import {
    activeTabState,
    hasControlsState,
    interactiveModeState,
    isActiveGlobalMuteAudioState,
    isActiveGlobalMuteVideoState,
    isActiveGlobalScreenshareState,
    isCanvasOpenState,
    isChatOpenState,
    isClassDetailsOpenState,
    isGlobalActionsOpenState,
    isLessonPlanOpenState,
    isViewModesOpenState,
    unreadMessagesState,
} from "@/store/layoutAtoms";
import { sleep } from "@/utils/utils";
import { useSynchronizedState } from "@/whiteboard/context-providers/SynchronizedStateProvider";
import {
    Grid,
    makeStyles,
    Theme,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { ChatSquareDotsFill as ChatIcon } from "@styled-icons/bootstrap/ChatSquareDotsFill";
import { PencilFill as CanvasIcon } from "@styled-icons/bootstrap/PencilFill";
import { UserVoice as OnStageIcon } from "@styled-icons/boxicons-solid/UserVoice";
import { Globe as GlobalActionsIcon } from "@styled-icons/entypo/Globe";
import { Info as InfoIcon } from "@styled-icons/evaicons-solid/Info";
import { Eye as ObserveIcon } from "@styled-icons/fa-regular/Eye";
import { PresentationChartBar as PresentIcon } from "@styled-icons/heroicons-solid/PresentationChartBar";
import { ScreenShare as ScreenShareIcon } from "@styled-icons/material/ScreenShare";
import { ChevronBottom as ViewModesIcon } from "@styled-icons/open-iconic/ChevronBottom";
import { FilePaper as LessonPlanIcon } from "@styled-icons/remix-fill/FilePaper";
import clsx from "clsx";
import React,
{
    useContext,
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";
import {
    useRecoilState,
    useRecoilValue,
} from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 10,
        justifyContent: `space-between`,
        color: theme.palette.text.primary,
        position: `relative`,
        zIndex: 9,
    },
    rootMosaic:{
        backgroundColor: `rgba(49,49,60,0.85)`,
        color: `#fff`,
        paddingLeft: 40,
        paddingRight: 40,
    },
    rootMd:{
        fontSize: `0.9rem`,
    },
    iconGroup: {
        display: `flex`,
        alignItems: `center`,
        margin: `0 -4px`,
    },
}));

export const viewModesBadge = (interactiveMode: InteractiveMode) => {
    switch (interactiveMode) {
    case InteractiveMode.ONSTAGE:
        return <OnStageIcon />;
    case InteractiveMode.OBSERVE:
        return <ObserveIcon />;
    case InteractiveMode.PRESENT:
        return <PresentIcon />;
    case InteractiveMode.SCREENSHARE:
        return <ScreenShareIcon />;
    default:
        return <OnStageIcon />;
    }
};

function Toolbar () {
    const classes = useStyles();
    const intl = useIntl();
    const {
        isTeacher,
        sessionId,
        roomId,
    } = useSessionContext();
    const webrtc = useContext(WebRTCContext);
    const { addOnBack } = useCordovaSystemContext();
    const [ isGlobalActionsOpen, setIsGlobalActionsOpen ] = useRecoilState(isGlobalActionsOpenState);
    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);
    const [ isViewModesOpen, setIsViewModesOpen ] = useRecoilState(isViewModesOpenState);
    const interactiveMode = useRecoilValue(interactiveModeState);
    const activeTab = useRecoilValue(activeTabState);
    const [ isChatOpen, setIsChatOpen ] = useRecoilState(isChatOpenState);
    const [ isClassDetailsOpen, setIsClassDetailsOpen ] = useRecoilState(isClassDetailsOpenState);
    const [ isCanvasOpen, setIsCanvasOpen ] = useRecoilState(isCanvasOpenState);
    const unreadMessages = useRecoilValue(unreadMessagesState);
    const hasControls = useRecoilValue(hasControlsState);

    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down(`md`));

    const classDetailsRef = React.useRef<any>();
    const canvasRef = React.useRef<any>();
    const globalActionsRef = React.useRef<any>();
    const viewModesRef = React.useRef<any>();
    const chatRef = React.useRef<any>();
    const lessonPlanRef = React.useRef<any>();

    const [ openEndClassDialog, setOpenEndClassDialog ] = useState(false);
    const [ openLeaveClassDialog, setOpenLeaveClassDialog ] = useState(false);

    const [ camOn, setCamOn ] = useState<boolean>(true);
    const [ micOn, setMicOn ] = useState<boolean>(true);

    const [ micMuteCurrent, setMicMuteCurrent ] = useRecoilState(isActiveGlobalMuteAudioState);
    const [ camMuteCurrent, setCamMuteCurrent ] = useRecoilState(isActiveGlobalMuteVideoState);

    const resetDrawers = () => {
        setIsGlobalActionsOpen(false);
        setIsLessonPlanOpen(false);
        setIsChatOpen(false);
        setIsClassDetailsOpen(false);
        setIsCanvasOpen(false);
        setIsViewModesOpen(false);
    };

    const [ muteMutation ] = useMuteMutation();

    function setOutboundAudioState (isMicOn: boolean) {
        const notification: MuteNotification = {
            roomId,
            sessionId,
            audio: isMicOn,
        };
        return muteMutation({
            variables: notification,
        });
    }

    function setOutboundVideoState (isCamOn: boolean) {
        const notification: MuteNotification = {
            roomId,
            sessionId,
            video: isCamOn,
        };
        return muteMutation({
            variables: notification,
        });
    }

    async function toggleOutboundAudioState () {
        await setOutboundAudioState(!micOn);
    }

    async function toggleOutboundVideoState () {
        await setOutboundVideoState(!camOn);
    }

    async function setCurrentOutboundAudioState () {
        if (micMuteCurrent === false) {
            //wait for update from UI
            await sleep(300);
            await setOutboundAudioState(false);
        }
        setMicMuteCurrent(null);
    }

    async function setCurrentOutboundVideoState () {
        if (camMuteCurrent === false) {
            await setOutboundVideoState(false);
        }
        setCamMuteCurrent(null);
    }

    async function resetOutboundVideoStateBackground () {
        await setOutboundAudioState(true);
        await setOutboundVideoState(true);
        setCurrentOutboundAudioState();
        setCurrentOutboundVideoState();
    }

    function endCall () {
        hasControls ? setOpenEndClassDialog(true) : setOpenLeaveClassDialog(true);
    }

    useEffect(()=> {
        resetDrawers();
    }, [ activeTab ]);

    const {
        state: { display: isGlobalCanvasEnabled, permissions: permissionsGlobalCanvas },
        actions: { setDisplay: setIsGlobalCanvasEnabled },
    } = useSynchronizedState();

    useEffect(() => {
        setIsCanvasOpen(isGlobalCanvasEnabled && permissionsGlobalCanvas.allowCreateShapes);
    }, [ isGlobalCanvasEnabled, permissionsGlobalCanvas.allowCreateShapes ]);

    useEffect(() => {
        setMicOn(webrtc.isAudioEnabledByProducer(sessionId) && !webrtc.isAudioDisabledLocally(sessionId));
    }, [ webrtc.isAudioEnabledByProducer(sessionId), webrtc.isAudioDisabledLocally(sessionId) ]);

    useEffect(() => {
        setCamOn(webrtc.isVideoEnabledByProducer(sessionId) && !webrtc.isVideoDisabledLocally(sessionId));
    }, [ webrtc.isVideoEnabledByProducer(sessionId), webrtc.isVideoDisabledLocally(sessionId) ]);

    async function onPauseStateChanged (isPaused: boolean) {
        if (isPaused) {
            setMicMuteCurrent(micOn);
            setCamMuteCurrent(camOn);
            await setOutboundAudioState(false);
            await setOutboundVideoState(false);
        } else {
            //Check stream of producer is connected successfully
            let countInterval = 0;
            const interval = setInterval(() => {
                if (webrtc.isConnectedTransmitStream()) {
                    resetOutboundVideoStateBackground();
                    clearInterval(interval);
                } else {
                    countInterval++;
                    if (countInterval >= 10) {
                        clearInterval(interval);
                    }
                }
            }, 1000);
        }
    }

    useCordovaObservePause(onPauseStateChanged);

    useEffect(() => {
        function initOnBack (){
            addOnBack?.({
                id: LIVE_ON_BACK_ID,
                isAutoRemove: false,
                onBack: () => {
                    endCall();
                },
            });
        }
        initOnBack();
    }, []);

    return (
        <>
            <Grid
                container
                className={clsx(classes.root, {
                    [classes.rootMosaic] : activeTab === `mosaic`,
                    [classes.rootMd] : isMdDown,
                })}>
                <Grid
                    item
                    className={classes.iconGroup}>
                    <div ref={classDetailsRef}>
                        <ToolbarItem
                            display={activeTab !== `mosaic`}
                            icon={<InfoIcon />}
                            label={intl.formatMessage({
                                id: `toolbar_class_details`,
                            })}
                            active={isClassDetailsOpen}
                            disabled={Boolean(handleTooltip(`classDetails`))}
                            tooltip={handleTooltip(`classDetails`)}
                            onClick={() => {
                                resetDrawers();
                                setIsClassDetailsOpen(!isClassDetailsOpen);
                            }}
                        />
                    </div>
                    <div ref={canvasRef}>
                        <ToolbarItem
                            display={activeTab === `mosaic` ? false : hasControls ? true : isGlobalCanvasEnabled && permissionsGlobalCanvas.allowCreateShapes}
                            icon={<CanvasIcon />}
                            label={intl.formatMessage({
                                id: `toolbar_canvas`,
                            })}
                            active={isCanvasOpen}
                            disabled={Boolean(handleTooltip(`canvas`))}
                            tooltip={handleTooltip(`canvas`)}
                            onClick={() => {
                                resetDrawers();
                                if(hasControls){
                                    setIsGlobalCanvasEnabled(!isGlobalCanvasEnabled);
                                }else{
                                    setIsCanvasOpen(!isCanvasOpen);
                                }
                            }}
                        />
                    </div>
                </Grid>
                <Grid
                    item
                    className={classes.iconGroup}>
                    <ToolbarItemMicrophone
                        id="toolbar-item-microphone"
                        active={micMuteCurrent === null ? micOn : micMuteCurrent}
                        tooltip={intl.formatMessage({
                            id: micOn ? `toggle_microphone_off` :  `toggle_microphone_on`,
                        })}
                        onClick={() =>  toggleOutboundAudioState() }
                    />
                    <ToolbarItemCall
                        id="toolbar-item-call"
                        locked={!isTeacher}
                        isHost={hasControls}
                        tooltip={!isTeacher ? intl.formatMessage({
                            id: `toolbar_endcall_ask_to_leave`,
                        }) : undefined}
                        src={LeaveClassIcon}
                        onClick={() => endCall()}
                    />
                    <ToolbarItemCamera
                        id="toolbar-item-camera"
                        active={camMuteCurrent === null ? camOn : camMuteCurrent}
                        tooltip={intl.formatMessage({
                            id: camOn ? `toggle_camera_off` :  `toggle_camera_on`,
                        })}
                        onClick={() =>  toggleOutboundVideoState() }
                    />
                </Grid>
                <Grid
                    item
                    className={classes.iconGroup}>
                    <div ref={globalActionsRef}>
                        <ToolbarItem
                            display={hasControls}
                            icon={<GlobalActionsIcon />}
                            label={intl.formatMessage({
                                id: `toolbar_global_actions`,
                            })}
                            disabled={Boolean(handleTooltip(`globalActions`))}
                            tooltip={handleTooltip(`globalActions`)}
                            active={isGlobalActionsOpen}
                            onClick={() => {
                                resetDrawers();
                                setIsGlobalActionsOpen(!isGlobalActionsOpen);
                            }}
                        />
                    </div>
                    <div ref={lessonPlanRef}>
                        <ToolbarItem
                            display={hasControls ? activeTab !== `mosaic` : false}
                            icon={<LessonPlanIcon />}
                            label={intl.formatMessage({
                                id: `toolbar_lesson_plan`,
                            })}
                            disabled={Boolean(handleTooltip(`lessonPlan`))}
                            tooltip={handleTooltip(`lessonPlan`)}
                            active={isLessonPlanOpen}
                            onClick={() => {
                                resetDrawers();
                                setIsLessonPlanOpen(!isLessonPlanOpen);
                            }}
                        />
                    </div>
                    <div ref={viewModesRef}>
                        <ToolbarItem
                            display={hasControls && activeTab !== `mosaic`}
                            icon={<ViewModesIcon />}
                            label={intl.formatMessage({
                                id: `toolbar_view_modes`,
                            })}
                            active={isViewModesOpen}
                            badge={viewModesBadge(interactiveMode)}
                            disabled={Boolean(handleTooltip(`viewModes`))}
                            tooltip={handleTooltip(`viewModes`)}
                            onClick={() => {
                                resetDrawers();
                                setIsViewModesOpen(!isViewModesOpen);
                            }}
                        />
                    </div>
                    <div ref={chatRef}>
                        <ToolbarItem
                            display={true}
                            icon={<ChatIcon />}
                            label={intl.formatMessage({
                                id: `toolbar_chat`,
                            })}
                            badge={unreadMessages ? unreadMessages : null}
                            active={isChatOpen}
                            onClick={() => {
                                resetDrawers();
                                setIsChatOpen(!isChatOpen);
                            }}
                        />
                    </div>
                </Grid>
            </Grid>

            <ClassDetailsMenu anchor={classDetailsRef.current} />
            <CanvasMenu anchor={canvasRef.current} />
            <ChatMenu anchor={chatRef.current} />
            {hasControls &&
                <>
                    <GlobalActionsMenu anchor={globalActionsRef.current} />
                    <ViewModesMenu anchor={viewModesRef.current} />
                    <LessonPlanMenu anchor={lessonPlanRef.current} />
                </>
            }

            <DialogEndClass
                open={openEndClassDialog}
                onClose={() => setOpenEndClassDialog(false)} />

            <DialogLeaveClass
                open={openLeaveClassDialog}
                onClose={() => setOpenLeaveClassDialog(false)} />

        </>
    );
}

export default Toolbar;

function handleTooltip (item: string){
    const intl = useIntl();
    const isActiveGlobalScreenshare = useRecoilValue(isActiveGlobalScreenshareState);
    const activeTab = useRecoilValue(activeTabState);

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
            screenshare: intl.formatMessage({
                id: `toolbar_view_modes_disabled_screenshare`,
            }),
            mosaic: `View modes are not available in mosaic mode`,
        },
    };

    if(isActiveGlobalScreenshare && tooltips[item]?.screenshare !== undefined){return tooltips[item].screenshare;}

    if(activeTab === `mosaic` && tooltips[item]?.mosaic !== undefined){return tooltips[item].mosaic;}

    return(``);
}
