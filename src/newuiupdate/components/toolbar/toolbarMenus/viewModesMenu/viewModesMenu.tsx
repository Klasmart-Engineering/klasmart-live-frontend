import {
    InteractiveMode,
    interactiveModeState,
    isViewModesOpenState,
    observeContentState,
    observeDisableState,
    observeWarningState,
} from "../../../../../store/layoutAtoms";
import ObserveWarning from "../../../utils/observeWarning";
import { StyledPopper } from "../../../utils/utils";
import ViewMode from "./viewMode";
import { Grid } from "@material-ui/core";
import { UserVoice as OnStageIcon } from "@styled-icons/boxicons-solid/UserVoice";
import { Eye as ObserveIcon } from "@styled-icons/fa-regular/Eye";
import { PresentationChartBar as PresentIcon } from "@styled-icons/heroicons-solid/PresentationChartBar";
import React from "react";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";

interface ViewModesMenuProps {
	anchor?: any;
}

function ViewModesMenu (props:ViewModesMenuProps) {
    const { anchor } = props;
    const intl = useIntl();
    const [ isViewModesOpen, setIsViewModesOpen ] = useRecoilState(isViewModesOpenState);
    const [ interactiveMode, setInteractiveMode ] = useRecoilState(interactiveModeState);
    const [ observeOpen, setObserveOpen ] = useRecoilState(observeWarningState);
    const [ observeContent, setObserveContent ] = useRecoilState(observeContentState);
    const [ observeDisable, setObserveDisable ] = useRecoilState(observeDisableState);

    const ObserveWarningActive = () => {
        const checkShow = localStorage.getItem(`ObserveWarning`) !== null ? localStorage.getItem(`ObserveWarning`) : `true`;
        switch (checkShow) {
        case `true`: setObserveOpen(true); break;
        case `false`: setInteractiveMode(InteractiveMode.Observe); break;
        }
    };

    return (
        <StyledPopper
            open={isViewModesOpen}
            anchorEl={anchor}>
            <Grid
                container
                alignItems="stretch" >
                <ViewMode
                    title={intl.formatMessage({
                        id: `viewmodes_on_stage`,
                    })}
                    icon={<OnStageIcon />}
                    active={interactiveMode === InteractiveMode.OnStage}
                    onClick={() => setInteractiveMode(InteractiveMode.OnStage)}
                />

                <ViewMode
                    disabled={observeDisable}
                    title={intl.formatMessage({
                        id: `viewmodes_observe`,
                    })}
                    icon={<ObserveIcon />}
                    active={interactiveMode === InteractiveMode.Observe && !observeOpen}
                    onClick={() => ObserveWarningActive()}
                />

                <ViewMode
                    title={intl.formatMessage({
                        id: `viewmodes_present`,
                    })}
                    icon={<PresentIcon />}
                    active={interactiveMode === InteractiveMode.Present}
                    onClick={() => setInteractiveMode(InteractiveMode.Present)}
                />

                <ObserveWarning
                    open={observeOpen}
                    onClose={() => setObserveOpen(false)}
                    onConfirm={() => {
                        setObserveOpen(false);
                        setObserveContent(!observeContent);
                        setInteractiveMode(InteractiveMode.Observe);
                    }}
                />

            </Grid>
        </StyledPopper>
    );
}

export default ViewModesMenu;
