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
import LeaveClassIcon from "@/assets/img/icon_leave_class.svg";
import StyledIcon from "@/components/styled/icon";
import { THEME_COLOR_PRIMARY_DEFAULT } from "@/config";
import { LIVE_ON_BACK_ID } from "@/pages/room/room-with-context";
import { InteractiveMode } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    activeTabState,
    ActiveTabStateType,
    hasControlsState,
    interactiveModeState,
    isCanvasOpenState,
    isChatOpenState,
    isClassDetailsOpenState,
    isGlobalActionsOpenState,
    isLessonPlanOpenState,
    isViewModesOpenState,
    unreadMessagesState,
} from "@/store/layoutAtoms";
import { useSynchronizedState } from "@/whiteboard/context-providers/SynchronizedStateProvider";
import {
    Grid,
    makeStyles,
    Theme,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { CameraVideoOffFill as CameraDisabledIcon } from "@styled-icons/bootstrap/CameraVideoOffFill";
import { CaretDownFill as CaretDownFill } from "@styled-icons/bootstrap/CaretDownFill";
import { CaretUpFill as CaretUpFill } from "@styled-icons/bootstrap/CaretUpFill";
import { ChatSquareDotsFill as ChatIcon } from "@styled-icons/bootstrap/ChatSquareDotsFill";
import { MicMuteFill as MicDisabledIcon } from "@styled-icons/bootstrap/MicMuteFill";
import { PencilFill as CanvasIcon } from "@styled-icons/bootstrap/PencilFill";
import { UserVoice as OnStageIcon } from "@styled-icons/boxicons-solid/UserVoice";
import { Heart as StickersActionsIcon } from "@styled-icons/entypo/Heart";
import { Info as InfoIcon } from "@styled-icons/evaicons-solid/Info";
import { Eye as ObserveIcon } from "@styled-icons/fa-regular/Eye";
import { PresentationChartBar as PresentIcon } from "@styled-icons/heroicons-solid/PresentationChartBar";
import { ScreenShare as ScreenShareIcon } from "@styled-icons/material/ScreenShare";
import { ChevronBottom as ViewModesIcon } from "@styled-icons/open-iconic/ChevronBottom";
import { FilePaper as LessonPlanIcon } from "@styled-icons/remix-fill/FilePaper";
import clsx from "clsx";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";
import {
    useRecoilState,
    useRecoilValue,
} from "recoil";

const CARRET_BUTTON_SIZE = 25;
const MAX_MOBILE_TOOLBAR_WIDTH = 754;

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 10,
        justifyContent: `space-between`,
        color: theme.palette.text.primary,
        position: `relative`,
        zIndex: 9,
        wrap: `nowrap`,
        [theme.breakpoints.down(`xs`)]: {
            flex: `0 1 auto`,
        },
    },
    rootTeacherMobile: {
        wrap: `wrap`,
        justifyContent: `center`,
    },
    rootMosaic: {
        backgroundColor: `rgba(49,49,60,0.85)`,
        color: `#fff`,
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),
    },
    rootMd: {
        fontSize: `0.9rem`,
    },
    iconGroup: {
        display: `flex`,
        alignItems: `center`,
        margin: `0 -4px`,
    },
    toolbar_canvas: {
        position: `relative`,
    },
    caretButton: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        left: 0,
        right: 0,
        margin: `0 auto`,
        width: CARRET_BUTTON_SIZE,
        height: CARRET_BUTTON_SIZE,
        borderRadius: CARRET_BUTTON_SIZE,
        position: `absolute`,
        cursor: `pointer`,
        backgroundColor: theme.palette.common.white,
        boxShadow: `0px 0px 6px 0px rgb(0 0 0 / 25%)`,
        top: -theme.spacing(2),
        zIndex: 9,
    },
    canvasIconGroup: {
        order: 2,
    },
    endClassIconGroup: {
        order: 1,
        width: `100%`,
        margin: 0,
        justifyContent: `center`,
    },
    globalActionsIconGroup: {
        order: 3,
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
    const { isTeacher, type } = useSessionContext();
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
    const isMobileWebToolbar = useMediaQuery(theme.breakpoints.down(MAX_MOBILE_TOOLBAR_WIDTH));

    const classDetailsRef = React.useRef<any>();
    const canvasRef = React.useRef<any>();
    const globalActionsRef = React.useRef<any>();
    const viewModesRef = React.useRef<any>();
    const chatRef = React.useRef<any>();
    const lessonPlanRef = React.useRef<any>();

    const [ openEndClassDialog, setOpenEndClassDialog ] = useState(false);
    const [ openLeaveClassDialog, setOpenLeaveClassDialog ] = useState(false);

    const resetDrawers = () => {
        setIsGlobalActionsOpen(false);
        setIsLessonPlanOpen(false);
        setIsChatOpen(false);
        setIsClassDetailsOpen(false);
        setIsViewModesOpen(false);
    };

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

    const caretDisplay = activeTab === ActiveTabStateType.MOSAIC ? false : hasControls ? true : isGlobalCanvasEnabled && permissionsGlobalCanvas.allowCreateShapes
        ;
    const [ showCanvasMenu, setShowCanvasMenu ] = useState<boolean>(true);

    return (
        <>
            <Grid
                container
                className={clsx(classes.root, {
                    [classes.rootMosaic]: activeTab === ActiveTabStateType.MOSAIC,
                    [classes.rootMd]: isMdDown,
                    [classes.rootTeacherMobile]: hasControls && isMobileWebToolbar,
                })}
            >
                <Grid
                    item
                    className={clsx(classes.iconGroup, {
                        [classes.canvasIconGroup]: hasControls && isMobileWebToolbar,
                    })}
                >
                    <div ref={classDetailsRef}>
                        <ToolbarItem
                            display={activeTab !== ActiveTabStateType.MOSAIC}
                            icon={<InfoIcon />}
                            label={intl.formatMessage({
                                id: `toolbar_class_details`,
                            })}
                            active={isClassDetailsOpen}
                            disabled={type === ClassType.PREVIEW}
                            onClick={() => {
                                resetDrawers();
                                setIsClassDetailsOpen(!isClassDetailsOpen);
                            }}
                        />
                    </div>
                    <div
                        ref={canvasRef}
                        className={classes.toolbar_canvas}
                    >
                        {isCanvasOpen && caretDisplay && (
                            <div
                                className={classes.caretButton}
                                onClick={() => { setShowCanvasMenu(show => !show); }}
                            >
                                <StyledIcon
                                    color={THEME_COLOR_PRIMARY_DEFAULT}
                                    icon={showCanvasMenu ? <CaretDownFill /> : <CaretUpFill />}
                                    size="small"
                                />
                            </div>
                        )}
                        <ToolbarItem
                            display={activeTab === ActiveTabStateType.MOSAIC ? false : hasControls ? true : isGlobalCanvasEnabled && permissionsGlobalCanvas.allowCreateShapes}
                            icon={<CanvasIcon />}
                            label={intl.formatMessage({
                                id: `toolbar_canvas`,
                            })}
                            active={isCanvasOpen}
                            disabled={type === ClassType.PREVIEW}
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
                    className={clsx(classes.iconGroup, {
                        [classes.endClassIconGroup]: hasControls && isMobileWebToolbar,
                    })}
                >
                    {type === ClassType.PREVIEW ? (
                        <ToolbarItem
                            display
                            disabled
                            icon={<MicDisabledIcon />}
                        />
                    ) : (
                        <ToolbarItemMicrophone />
                    )}

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

                    {type === ClassType.PREVIEW ? (
                        <ToolbarItem
                            display
                            disabled
                            icon={<CameraDisabledIcon />}
                        />
                    ) : (
                        <ToolbarItemCamera />
                    )}
                </Grid>
                <Grid
                    item
                    className={clsx(classes.iconGroup, {
                        [classes.globalActionsIconGroup]: hasControls && isMobileWebToolbar,
                    })}
                >
                    <div ref={globalActionsRef}>
                        <ToolbarItem
                            display={hasControls}
                            icon={<StickersActionsIcon />}
                            label={intl.formatMessage({
                                id: `live.class.stickers`,
                            })}
                            active={isGlobalActionsOpen}
                            disabled={type === ClassType.PREVIEW}
                            onClick={() => {
                                resetDrawers();
                                setIsGlobalActionsOpen(!isGlobalActionsOpen);
                            }}
                        />
                    </div>
                    <div ref={lessonPlanRef}>
                        <ToolbarItem
                            display={hasControls && activeTab !== ActiveTabStateType.MOSAIC}
                            icon={<LessonPlanIcon />}
                            label={intl.formatMessage({
                                id: `toolbar_lesson_plan`,
                            })}
                            active={isLessonPlanOpen}
                            onClick={() => {
                                resetDrawers();
                                setIsLessonPlanOpen(!isLessonPlanOpen);
                            }}
                        />
                    </div>
                    <div ref={viewModesRef}>
                        <ToolbarItem
                            display={hasControls && activeTab !== ActiveTabStateType.MOSAIC}
                            icon={<ViewModesIcon />}
                            label={intl.formatMessage({
                                id: `toolbar_view_modes`,
                            })}
                            active={isViewModesOpen}
                            disabled={type === ClassType.PREVIEW}
                            badge={type !== ClassType.PREVIEW && viewModesBadge(interactiveMode)}
                            onClick={() => {
                                resetDrawers();
                                setIsViewModesOpen(!isViewModesOpen);
                            }}
                        />
                    </div>
                    <div ref={chatRef}>
                        <ToolbarItem
                            display
                            icon={<ChatIcon />}
                            label={intl.formatMessage({
                                id: `toolbar_chat`,
                            })}
                            badge={type !== ClassType.PREVIEW && unreadMessages}
                            active={isChatOpen}
                            disabled={type === ClassType.PREVIEW}
                            onClick={() => {
                                resetDrawers();
                                setIsChatOpen(!isChatOpen);
                            }}
                        />
                    </div>
                </Grid>
            </Grid>

            <ClassDetailsMenu anchor={classDetailsRef.current} />

            {activeTab !== ActiveTabStateType.MOSAIC && (
                <CanvasMenu
                    anchor={canvasRef.current}
                    showCanvasMenu={showCanvasMenu}
                />
            )}

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
                onClose={() => setOpenEndClassDialog(false)}
            />

            <DialogLeaveClass
                open={openLeaveClassDialog}
                onClose={() => setOpenLeaveClassDialog(false)}
            />

        </>
    );
}

export default Toolbar;
