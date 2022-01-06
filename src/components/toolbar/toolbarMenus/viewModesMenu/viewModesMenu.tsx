import ViewMode from "./viewMode";
import ObserveWarning from "@/components/observeWarning";
import { OBSERVE_WARNING_DEFAULT } from "@/config";
import { InteractiveMode } from "@/pages/utils";
import { ScreenShareContext } from "@/providers/screenShareProvider";
import {
    interactiveModeState,
    isViewModesOpenState,
    observeContentState,
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
{ useContext } from "react";
import { isBrowser } from "react-device-detect";
import { useIntl } from "react-intl";
import {
    useRecoilState,
    useRecoilValue,
} from "recoil";

interface ViewModesMenuProps {
	anchor?: HTMLElement;
}

function ViewModesMenu (props:ViewModesMenuProps) {
    const { anchor } = props;
    const intl = useIntl();
    const [ interactiveMode, setInteractiveMode ] = useRecoilState(interactiveModeState);
    const [ observeOpen, setObserveOpen ] = useRecoilState(observeWarningState);
    const [ observeContent, setObserveContent ] = useRecoilState(observeContentState);
    const isViewModesOpen = useRecoilValue(isViewModesOpenState);
    const observeDisable = useRecoilValue(observeDisableState);
    const screenShare = useContext(ScreenShareContext);

    const ObserveWarningActive = () => {
        const checkShow = (localStorage.getItem(`ObserveWarning`) ?? OBSERVE_WARNING_DEFAULT) === `true`;
        checkShow ? setObserveOpen(true) : setInteractiveMode(InteractiveMode.OBSERVE);
    };

    const handleViewModesClick = (interactiveMode: InteractiveMode) => {
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
            if (!isBrowser) return;
            screenShare.start();
            break;
        }
    };

    return (
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
                    active={interactiveMode === InteractiveMode.SCREENSHARE && isBrowser}
                    disabled={!isBrowser}
                    disabledTooltip={intl.formatMessage({
                        id: `live.class.shareScreen.error.notAvailable`,
                    }, {
                        strong: (modeName) => <strong>{modeName}</strong>,
                    })}
                    onClick={() => handleViewModesClick(InteractiveMode.SCREENSHARE)}
                />
                <ObserveWarning
                    open={observeOpen}
                    onClose={() => setObserveOpen(false)}
                    onConfirm={() => {
                        setObserveOpen(false);
                        setObserveContent(!observeContent);
                        setInteractiveMode(InteractiveMode.OBSERVE);
                    }}
                />
            </Grid>
        </StyledPopper>
    );
}

export default ViewModesMenu;
