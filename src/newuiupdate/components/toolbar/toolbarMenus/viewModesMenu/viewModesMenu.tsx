import { ContentType } from "../../../../../pages/room/room";
import { LIVE_LINK, LocalSessionContext } from "../../../../providers/providers";
import { RoomContext } from "../../../../providers/roomContext";
import { isViewModesOpenState, interactiveModeState, InteractiveMode } from "../../../../states/layoutAtoms";
import { MUTATION_SHOW_CONTENT } from "../../../utils/graphql";
import { StyledPopper } from "../../../utils/utils";
import ViewMode from "./viewMode";
import { useMutation } from "@apollo/client";
import { Grid } from "@material-ui/core";
import { UserVoice as OnStageIcon } from "@styled-icons/boxicons-solid/UserVoice";
import { Eye as ObserveIcon } from "@styled-icons/fa-regular/Eye";
import { PresentationChartBar as PresentIcon } from "@styled-icons/heroicons-solid/PresentationChartBar";
import React, { useContext } from "react";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";

interface ViewModesMenuProps {
	anchor?: any;
}

function ViewModesMenu (props:ViewModesMenuProps) {
    const { anchor } = props;
    const intl = useIntl();
    const { roomId, sessionId } = useContext(LocalSessionContext);
    const { content } = useContext(RoomContext);
    const [ isViewModesOpen, setIsViewModesOpen ] = useRecoilState(isViewModesOpenState);
    const [ interactiveMode, setInteractiveMode ] = useRecoilState(interactiveModeState);


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
                    title={intl.formatMessage({
                        id: `viewmodes_observe`,
                    })}
                    icon={<ObserveIcon />}
                    active={interactiveMode === InteractiveMode.Observe}
                    onClick={() => setInteractiveMode(InteractiveMode.Observe)}
                />

                <ViewMode
                    title={intl.formatMessage({
                        id: `viewmodes_present`,
                    })}
                    icon={<PresentIcon />}
                    active={interactiveMode === InteractiveMode.Present}
                    onClick={() => setInteractiveMode(InteractiveMode.Present)}
                />

            </Grid>
        </StyledPopper>
    );
}

export default ViewModesMenu;
