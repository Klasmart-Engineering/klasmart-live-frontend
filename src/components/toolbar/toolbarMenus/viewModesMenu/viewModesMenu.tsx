import ViewMode from "./viewMode";
import AlertPopper from "@/components/common/AlertPopper";
import ObserveWarning from "@/components/observeWarning";
import { OBSERVE_WARNING_DEFAULT } from "@/config";
import { InteractiveMode } from "@/pages/utils";
import { ScreenShareContext } from "@/providers/screenShareProvider";
import {
    interactiveModeState,
    isViewModesOpenState,
    observeDisableState,
    observeWarningState,
} from "@/store/layoutAtoms";
import { StyledPopper } from "@/utils/utils";
import { Grid } from "@material-ui/core";
import { UserVoice as OnStageIcon } from "@styled-icons/boxicons-solid/UserVoice";
import { Eye as ObserveIcon } from "@styled-icons/fa-regular/Eye";
import { PresentationChartBar as PresentIcon } from "@styled-icons/heroicons-solid/PresentationChartBar";
import { ScreenShare as ScreenShareIcon } from "@styled-icons/material/ScreenShare";
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
	anchor?: HTMLElement;
}

interface AlertProps {
    open: boolean;
    anchorEl: HTMLDivElement | null;
    title?: React.ReactNode;
    width?: number;
}

function ViewModesMenu (props:ViewModesMenuProps) {
    const { anchor } = props;
    const intl = useIntl();
    const [ interactiveMode, setInteractiveMode ] = useRecoilState(interactiveModeState);
    const [ observeOpen, setObserveOpen ] = useRecoilState(observeWarningState);
    const isViewModesOpen = useRecoilValue(isViewModesOpenState);
    const observeDisable = useRecoilValue(observeDisableState);
    const screenShare = useContext(ScreenShareContext);
    const [ alert, setAlert ] = useState<AlertProps>();
    const isDisabledShareScreen = !navigator.mediaDevices;

    const ObserveWarningActive = () => {
        const checkShow = (localStorage.getItem(`ObserveWarning`) ?? OBSERVE_WARNING_DEFAULT) === `true`;
        checkShow ? setObserveOpen(true) : setInteractiveMode(InteractiveMode.OBSERVE);
    };

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

    const handleViewModesClick = (interactiveMode: InteractiveMode, buttonRef?:React.MutableRefObject<HTMLDivElement | null>) => {
        if(screenShare.stream) screenShare.stop();

        switch(interactiveMode){
        case InteractiveMode.ONSTAGE :
            setInteractiveMode(InteractiveMode.ONSTAGE);
            break;
        case InteractiveMode.OBSERVE :
            ObserveWarningActive();
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
                <Grid
                    container
                    alignItems="stretch">

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
                        active={interactiveMode === InteractiveMode.OBSERVE && !observeOpen}
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
                    <ObserveWarning
                        open={observeOpen}
                        onClose={() => setObserveOpen(false)}
                        onConfirm={() => {
                            setObserveOpen(false);
                            setInteractiveMode(InteractiveMode.OBSERVE);
                        }}
                    />
                </Grid>
            </StyledPopper>
            <AlertPopper {...alert} />
        </>
    );
}

export default ViewModesMenu;
