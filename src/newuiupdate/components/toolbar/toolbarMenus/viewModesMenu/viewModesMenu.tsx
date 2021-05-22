import { ContentType } from "../../../../../pages/room/room";
import { LIVE_LINK, LocalSessionContext } from "../../../../providers/providers";
import { RoomContext } from "../../../../providers/roomContext";
import { isViewModesOpenState } from "../../../../states/layoutAtoms";
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
    const [ showContent, { loading: loadingShowContent } ] = useMutation(MUTATION_SHOW_CONTENT, {
        context: {
            target: LIVE_LINK,
        },
    });

    const switchContent = (type:ContentType) => {
        showContent({
            variables: {
                roomId,
                type: type,
                contentId: sessionId,
            },
        });
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
                    active={content?.type === ContentType.Blank || content?.type === ContentType.Camera}
                    onClick={() => switchContent(ContentType.Camera)}
                />

                <ViewMode
                    title={intl.formatMessage({
                        id: `viewmodes_observe`,
                    })}
                    icon={<ObserveIcon />}
                    active={content?.type === ContentType.Activity}
                    onClick={() => switchContent(ContentType.Activity)}
                />

                <ViewMode
                    title={intl.formatMessage({
                        id: `viewmodes_present`,
                    })}
                    icon={<PresentIcon />}
                    active={content?.type === ContentType.Stream || content?.type === ContentType.Image || content?.type === ContentType.Audio || content?.type === ContentType.Video}
                    onClick={() => switchContent(ContentType.Stream)}
                />

            </Grid>
        </StyledPopper>
    );
}

export default ViewModesMenu;
