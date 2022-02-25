import ViewMode from "./viewMode";
import AlertPopper from "@/components/common/AlertPopper";
import { InteractiveMode } from "@/pages/utils";
import { ScreenShareContext } from "@/providers/screenShareProvider";
import {
    interactiveModeState,
    isViewModesOpenState,
    observeDisableState,
    observeWarningState,
} from "@/store/layoutAtoms";
import { StyledPopper } from "@/utils/utils";
import { Box } from "@material-ui/core";
import { UserVoice as OnStageIcon } from "@styled-icons/boxicons-solid/UserVoice";
import { Eye as ObserveIcon } from "@styled-icons/fa-regular/Eye";
import { PresentationChartBar as PresentIcon } from "@styled-icons/heroicons-solid/PresentationChartBar";
import { ScreenShare as ScreenShareIcon } from "@styled-icons/material/ScreenShare";
import { useSnackbar } from "kidsloop-px";
import React,
{
    useCallback,
    useContext,
    useState,
} from "react";
import { useIntl } from "react-intl";
import {
    useRecoilState,
    useRecoilValue,
} from "recoil";

const ALERT_FALLBACK_WIDTH = 411;
const ALERT_VISIBLE_TIME = 1500;

interface ViewModesMenuProps {
	anchor: HTMLElement;
}

interface AlertProps {
    open: boolean;
    anchorEl: HTMLDivElement | HTMLButtonElement | null;
    title?: React.ReactNode;
    width?: number;
}

function ViewModesMenu (props:ViewModesMenuProps) {
    const { anchor } = props;
    const intl = useIntl();
    const [ interactiveMode, setInteractiveMode ] = useRecoilState(interactiveModeState);
    const [ observeWarning, setObserveWarning ] = useRecoilState(observeWarningState);
    const isViewModesOpen = useRecoilValue(isViewModesOpenState);
    const observeDisable = useRecoilValue(observeDisableState);
    const screenShare = useContext(ScreenShareContext);
    const [ alert, setAlert ] = useState<AlertProps>();
    const isDisabledShareScreen = typeof navigator.mediaDevices?.getDisplayMedia !== `function`;
    const { enqueueSnackbar } = useSnackbar();

    const onCloseAlert = useCallback(() => {
        if (!isDisabledShareScreen) return;
        setTimeout(() => {
            setAlert({
                ...alert,
                open: false,
                anchorEl: null,
            });
        }, ALERT_VISIBLE_TIME);
    }, [ alert?.anchorEl ]);

    const handleViewModesClick = (interactiveMode: InteractiveMode, buttonRef?:React.MutableRefObject<HTMLDivElement | HTMLButtonElement | null>) => {
        if(screenShare.stream) screenShare.stop();

        switch(interactiveMode){
        case InteractiveMode.ONSTAGE :
            setInteractiveMode(InteractiveMode.ONSTAGE);
            break;
        case InteractiveMode.OBSERVE :
            setInteractiveMode(InteractiveMode.OBSERVE);
            if(observeWarning){
                setObserveWarning(false);
                enqueueSnackbar(intl.formatMessage({
                    id: `observe_warning_videotype_text`,
                }));
            }
            break;
        case InteractiveMode.PRESENT :
            setInteractiveMode(InteractiveMode.PRESENT);
            break;
        case InteractiveMode.SCREENSHARE:
            if (!isDisabledShareScreen) {
                screenShare.start();
                return;
            }
            setAlert({
                open: true,
                anchorEl: buttonRef?.current ?? null,
                title: intl.formatMessage({
                    id: `live.class.shareScreen.error.notAvailable`,
                }, {
                    strong: (modeName) => <strong>{modeName}</strong>,
                }),
                width: buttonRef?.current?.offsetParent?.clientWidth ?? ALERT_FALLBACK_WIDTH,
            });
            break;
        }
    };

    return (
        <>
            <StyledPopper
                open={isViewModesOpen}
                anchorEl={anchor}>
                <Box display="flex" >
                    <ViewMode
                        title={intl.formatMessage({
                            id: `viewMode.onStage`,
                        })}
                        icon={OnStageIcon}
                        active={interactiveMode === InteractiveMode.ONSTAGE}
                        onClick={() => handleViewModesClick(InteractiveMode.ONSTAGE)}
                    />
                    <ViewMode
                        disabled={observeDisable}
                        title={intl.formatMessage({
                            id: `viewMode.observe`,
                        })}
                        icon={ObserveIcon}
                        active={interactiveMode === InteractiveMode.OBSERVE}
                        onClick={() => handleViewModesClick(InteractiveMode.OBSERVE)}
                    />
                    <ViewMode
                        title={intl.formatMessage({
                            id: `viewMode.present`,
                        })}
                        icon={PresentIcon}
                        active={interactiveMode === InteractiveMode.PRESENT}
                        onClick={() => handleViewModesClick(InteractiveMode.PRESENT)}
                    />
                    <ViewMode
                        title={intl.formatMessage({
                            id: `viewMode.screenShare`,
                        })}
                        icon={ScreenShareIcon}
                        active={interactiveMode === InteractiveMode.SCREENSHARE}
                        disabled={isDisabledShareScreen}
                        onCloseAlert={onCloseAlert}
                        onClick={(buttonRef) => handleViewModesClick(InteractiveMode.SCREENSHARE, buttonRef)}
                    />
                </Box>
            </StyledPopper>
            <AlertPopper {...alert} />
        </>
    );
}

export default ViewModesMenu;
