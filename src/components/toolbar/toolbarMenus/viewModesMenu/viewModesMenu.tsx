import ViewMode from "./viewMode";
import ViewModeScreenshare from "./viewModeScreenshare";
import AlertPopper from "@/components/common/AlertPopper";
import { InteractiveMode } from "@/pages/utils";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    interactiveModeState,
    isViewModesOpenState,
    observeDisableState,
    observeWarningState,
} from "@/store/layoutAtoms";
import { StyledPopper } from "@/utils/utils";
import { useSnackbar } from "@kl-engineering/kidsloop-px";
import {
    Box,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { UserVoice as OnStageIcon } from "@styled-icons/boxicons-solid/UserVoice";
import { Eye as ObserveIcon } from "@styled-icons/fa-regular/Eye";
import { PresentationChartBar as PresentIcon } from "@styled-icons/heroicons-solid/PresentationChartBar";
import { ScreenShare as ScreenShareIcon } from "@styled-icons/material/ScreenShare";
import React from "react";
import { useIntl } from "react-intl";
import {
    useRecoilState,
    useRecoilValue,
} from "recoil";

interface ViewModesMenuProps {
	anchor: HTMLElement;
}

function ViewModesMenu (props: ViewModesMenuProps) {
    const { anchor } = props;
    const intl = useIntl();
    const { type } = useSessionContext();
    const theme = useTheme();
    const [ interactiveMode, setInteractiveMode ] = useRecoilState(interactiveModeState);
    const [ observeWarning, setObserveWarning ] = useRecoilState(observeWarningState);
    const [ isViewModesOpen, setIsViewModesOpen ] = useRecoilState(isViewModesOpenState);
    const observeDisable = useRecoilValue(observeDisableState);
    const { enqueueSnackbar } = useSnackbar();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    const onClickOnStage = () => setInteractiveMode(InteractiveMode.ONSTAGE);
    const onClickPresent = () => setInteractiveMode(InteractiveMode.PRESENT);

    const onClickObserver = () => {
        setInteractiveMode(InteractiveMode.OBSERVE);
        if(observeWarning){
            setObserveWarning(false);
            enqueueSnackbar(intl.formatMessage({
                id: `observe_warning_videotype_text`,
            }));
        }
    };

    return (
        <>
            <StyledPopper
                open={isViewModesOpen}
                anchorEl={anchor}
                dialog={isSmDown}
                dialogClose={() => setIsViewModesOpen(open => !open)}
            >
                <Box display="flex" >
                    <ViewMode
                        title={intl.formatMessage({
                            id: `viewMode.onStage`,
                        })}
                        icon={OnStageIcon}
                        active={interactiveMode === InteractiveMode.ONSTAGE}
                        onClick={onClickOnStage}
                    />
                    <ViewMode
                        disabled={type === ClassType.PREVIEW || observeDisable}
                        title={intl.formatMessage({
                            id: `viewMode.observe`,
                        })}
                        icon={ObserveIcon}
                        active={interactiveMode === InteractiveMode.OBSERVE}
                        onClick={onClickObserver}
                    />
                    <ViewMode
                        title={intl.formatMessage({
                            id: `viewMode.present`,
                        })}
                        icon={PresentIcon}
                        active={interactiveMode === InteractiveMode.PRESENT}
                        onClick={onClickPresent}
                    />
                    {type === ClassType.PREVIEW ? (
                        <ViewMode
                            disabled
                            title={intl.formatMessage({
                                id: `viewMode.screenShare`,
                            })}
                            icon={ScreenShareIcon}
                            onClick={() => void 0}
                        />
                    ) : (
                        <ViewModeScreenshare />
                    )}
                </Box>
            </StyledPopper>
            <AlertPopper {...alert} />
        </>
    );
}

export default ViewModesMenu;
