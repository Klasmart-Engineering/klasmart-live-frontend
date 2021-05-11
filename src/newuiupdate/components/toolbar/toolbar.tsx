import { ContentType } from "../../../pages/room/room";
import { LocalSessionContext, SFU_LINK } from "../../providers/providers";
import { RoomContext } from "../../providers/roomContext";
import {
    MUTE, MuteNotification, WebRTCContext,
} from "../../providers/WebRTCContext";
import {
    activeTabState,
    hasControlsState,
    interactiveModeState,
    isActiveGlobalScreenshareState,
    isCanvasOpenState,
    isChatOpenState,
    isClassDetailsOpenState,
    isGlobalActionsOpenState,
    isLessonPlanOpenState,
    isViewModesOpenState,
    unreadMessagesState,
    userState,
    videoGloballyMutedState,
} from "../../states/layoutAtoms";
import { useSynchronizedState } from "../../whiteboard/context-providers/SynchronizedStateProvider";
import { DialogEndClass, DialogLeaveClass } from "../utils/endCall";
import ToolbarItem from "./toolbarItem";
import ToolbarItemCall from "./toolbarItemCall";
import ToolbarItemCamera from "./toolbarItemCamera";
import ToolbarItemMicrophone from "./toolbarItemMicrophone";
import CanvasMenu from "./toolbarMenus/canvasMenu";
import ClassDetailsMenu from "./toolbarMenus/classDetailsMenu/classDetailsMenu";
import GlobalActionsMenu from "./toolbarMenus/globalActionsMenu/globalActionsMenu";
import ViewModesMenu from "./toolbarMenus/viewModesMenu/viewModesMenu";
import { useMutation } from "@apollo/client";
import {
    Grid,
    makeStyles,
    Theme,
    useMediaQuery,
    useTheme,
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
import React, {
    useContext, useEffect, useState,
} from "react";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 10,
        marginTop: -10,
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

function Toolbar () {
    const classes = useStyles();
    const intl = useIntl();
    const {
        isTeacher, sessionId, roomId,
    } = useContext(LocalSessionContext);
    const webrtc = useContext(WebRTCContext);
    const { content } = useContext(RoomContext);

    const [ isGlobalActionsOpen, setIsGlobalActionsOpen ] = useRecoilState(isGlobalActionsOpenState);
    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);
    const [ isViewModesOpen, setIsViewModesOpen ] = useRecoilState(isViewModesOpenState);
    const [ activeTab, setActiveTab ] = useRecoilState(activeTabState);
    const [ isChatOpen, setIsChatOpen ] = useRecoilState(isChatOpenState);
    const [ isClassDetailsOpen, setIsClassDetailsOpen ] = useRecoilState(isClassDetailsOpenState);
    const [ isCanvasOpen, setIsCanvasOpen ] = useRecoilState(isCanvasOpenState);
    const [ interactiveMode, setInteractiveMode ] = useRecoilState(interactiveModeState);
    const [ unreadMessages, setUnreadMessages ] = useRecoilState(unreadMessagesState);
    const [ hasControls, setHasControls ] = useRecoilState(hasControlsState);
    const [ videoGloballyMuted, setVideoGloballyMuted ] = useRecoilState(videoGloballyMutedState);

    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down(`md`));

    const classDetailsRef = React.useRef<any>();
    const canvasRef = React.useRef<any>();
    const globalActionsRef = React.useRef<any>();
    const viewModesRef = React.useRef<any>();

    const [ openEndClassDialog, setOpenEndClassDialog ] = useState(false);
    const [ openLeaveClassDialog, setOpenLeaveClassDialog ] = useState(false);

    const [ camOn, setCamOn ] = useState<boolean>(true);
    const [ micOn, setMicOn ] = useState<boolean>(true);

    const resetDrawers = () => {
        setIsGlobalActionsOpen(false);
        setIsLessonPlanOpen(false);
        setIsChatOpen(false);
        setIsClassDetailsOpen(false);
        setIsCanvasOpen(false);
        setIsGlobalActionsOpen(false);
        setIsViewModesOpen(false);
    };

    const [ muteMutation ] = useMutation(MUTE, {
        context: {
            target: SFU_LINK,
        },
    });

    async function toggleOutboundAudioState () {
        const notification: MuteNotification = {
            roomId,
            sessionId,
            audio: !micOn,
        };
        const muteNotification = await muteMutation({
            variables: notification,
        });
    }

    async function toggleOutboundVideoState () {
        const notification: MuteNotification = {
            roomId,
            sessionId,
            video: !camOn,
        };
        const muteNotification = await muteMutation({
            variables: notification,
        });
    }

    function endCall () {
        hasControls ? setOpenEndClassDialog(true) : setOpenLeaveClassDialog(true);
    }

    let viewModesBadge = <OnStageIcon />;
    switch (content?.type) {
    case ContentType.Camera: viewModesBadge = <OnStageIcon />;
        break;
    case ContentType.Activity: viewModesBadge = <ObserveIcon />;
        break;
    case ContentType.Stream: viewModesBadge = <PresentIcon />;
        break;
    case ContentType.Video: viewModesBadge = <PresentIcon />;
        break;
    case ContentType.Audio: viewModesBadge = <PresentIcon />;
        break;
    case ContentType.Image: viewModesBadge = <PresentIcon />;
        break;
    default: viewModesBadge = <OnStageIcon />;
        break;
    }

    useEffect(()=> {
        resetDrawers();
    }, [ activeTab ]);

    const { state: { display: isGlobalCanvasEnabled, permissions: permissionsGlobalCanvas } } = useSynchronizedState();

    useEffect(() => {
        activeTab !== `mosaic` && isGlobalCanvasEnabled && setIsCanvasOpen(permissionsGlobalCanvas.allowCreateShapes);
        !isGlobalCanvasEnabled && setIsCanvasOpen(false);
    }, [ isGlobalCanvasEnabled, permissionsGlobalCanvas.allowCreateShapes ]);

    useEffect(() => {
        setMicOn(webrtc.isLocalAudioEnabled(sessionId));
    }, [ webrtc.isLocalAudioEnabled(sessionId) ]);

    useEffect(() => {
        setCamOn(webrtc.isLocalVideoEnabled(sessionId));
    }, [ webrtc.isLocalVideoEnabled(sessionId) ]);

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
                            onClick={(e: Event) => {
                                resetDrawers();
                                setIsClassDetailsOpen(!isClassDetailsOpen);
                            }}
                        />
                    </div>
                    <div ref={canvasRef}>
                        <ToolbarItem
                            display={activeTab === `mosaic` ? false : hasControls ? true : isGlobalCanvasEnabled && permissionsGlobalCanvas.allowCreateShapes ? true : false}
                            icon={<CanvasIcon />}
                            label={intl.formatMessage({
                                id: `toolbar_canvas`,
                            })}
                            active={isCanvasOpen}
                            disabled={Boolean(handleTooltip(`canvas`))}
                            tooltip={handleTooltip(`canvas`)}
                            onClick={(e: Event) => {
                                resetDrawers();
                                setIsCanvasOpen(!isCanvasOpen);
                            }}
                        />
                    </div>
                </Grid>
                <Grid
                    item
                    className={classes.iconGroup}>
                    <ToolbarItemMicrophone
                        // locked={}
                        active={micOn}
                        // tooltip={user.isTeacherAudioMuted ? intl.formatMessage({
                        //     id: `toolbar_microphonelocked`,
                        // }) : undefined}
                        onClick={() =>  toggleOutboundAudioState() }
                    />
                    <ToolbarItemCall
                        locked={!isTeacher}
                        tooltip={!isTeacher ? intl.formatMessage({
                            id: `toolbar_endcall_ask_to_leave`,
                        }) : undefined}
                        icon={<PhoneInTalkIcon />}
                        onClick={() => endCall()}
                    />
                    <ToolbarItemCamera
                        // locked={videoGloballyMuted}
                        active={camOn}
                        // tooltip={videoGloballyMutedState ? intl.formatMessage({
                        //     id: `toolbar_camera_locked`,
                        // }) : undefined}
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
                            onClick={(e: Event) => {
                                resetDrawers();
                                setIsGlobalActionsOpen(!isGlobalActionsOpen);
                            }}
                        />
                    </div>
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
                    <div ref={viewModesRef}>
                        <ToolbarItem
                            display={hasControls ? activeTab !== `mosaic` : false}
                            icon={<ViewModesIcon />}
                            label={intl.formatMessage({
                                id: `toolbar_view_modes`,
                            })}
                            active={isViewModesOpen}
                            badge={viewModesBadge}
                            disabled={Boolean(handleTooltip(`viewModes`))}
                            tooltip={handleTooltip(`viewModes`)}
                            onClick={(e: Event) => {
                                resetDrawers();
                                setIsViewModesOpen(!isViewModesOpen);
                            }}
                        />
                    </div>
                    <ToolbarItem
                        display={true}
                        icon={<ChatIcon />}
                        label={intl.formatMessage({
                            id: `toolbar_chat`,
                        })}
                        badge={unreadMessages ? unreadMessages : null}
                        active={isChatOpen}
                        onClick={(e: Event) => {
                            resetDrawers();
                            setIsChatOpen(!isChatOpen);
                        }}
                    />
                </Grid>
            </Grid>

            <ClassDetailsMenu anchor={classDetailsRef.current} />
            <CanvasMenu anchor={canvasRef.current} />
            <GlobalActionsMenu anchor={globalActionsRef.current} />
            <ViewModesMenu anchor={viewModesRef.current} />

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
