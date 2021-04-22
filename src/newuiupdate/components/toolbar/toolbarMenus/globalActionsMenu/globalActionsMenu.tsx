import { LIVE_LINK, LocalSessionContext } from "../../../../providers/providers";
import {
    isActiveGlobalCanvasState,
    isActiveGlobalMuteAudioState,
    isActiveGlobalMuteVideoState,
    isActiveGlobalScreenshareState,
    isGlobalActionsOpenState,
    pinnedUserState,
} from "../../../../states/layoutAtoms";
import { MUTATION_REWARD_TROPHY } from "../../../utils/graphql";
import { StyledPopper } from "../../../utils/utils";
import GlobalActionsMenuItem from "./globalAction";
import { useMutation } from "@apollo/client";
import {
    Grid, makeStyles, Theme,
} from "@material-ui/core";
import { CameraVideoFill as CameraVideoFillIcon } from "@styled-icons/bootstrap/CameraVideoFill";
import { CameraVideoOffFill as CameraDisabledIcon } from "@styled-icons/bootstrap/CameraVideoOffFill";
import { HandThumbsUpFill as HandThumbsUpFillIcon } from "@styled-icons/bootstrap/HandThumbsUpFill";
import { HeartFill as HeartFillIcon } from "@styled-icons/bootstrap/HeartFill";
import { MicFill as MicFillIcon } from "@styled-icons/bootstrap/MicFill";
import { MicMuteFill as MicDisabledIcon } from "@styled-icons/bootstrap/MicMuteFill";
import { StarFill as StarFillIcon } from "@styled-icons/bootstrap/StarFill";
import { TrophyFill as TrophyFillIcon } from "@styled-icons/bootstrap/TrophyFill";
import { TvFill as ScreenShareIcon } from "@styled-icons/bootstrap/TvFill";
import React, { useContext } from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 4,
    },
}));

interface GlobaActionsMenuProps {
	anchor?: any;
}

function GlobalActionsMenu (props: GlobaActionsMenuProps) {
    const { anchor } = props;
    const classes = useStyles();

    const [ isGlobalActionsOpen, setIsGlobalActionsOpen ] = useRecoilState(isGlobalActionsOpenState);

    const [ activeGlobalScreenshare, setActiveGlobalScreenshare ] = useRecoilState(isActiveGlobalScreenshareState);
    const [ activeGlobalCanvas, setActiveGlobalCanvas ] = useRecoilState(isActiveGlobalCanvasState);
    const [ activeGlobalMuteAudio, setActiveGlobalMuteAudio ] = useRecoilState(isActiveGlobalMuteAudioState);
    const [ activeGlobalMuteVideo, setActiveGlobalMuteVideo ] = useRecoilState(isActiveGlobalMuteVideoState);

    const [ pinnedUser, setPinnedUser ] = useRecoilState(pinnedUserState);

    const { roomId, sessionId } = useContext(LocalSessionContext);

    // TODO : Not working yet - sessionId from session context is different from the sessions in the roomcontext (something with how/where uuid is used i guess)
    const [ rewardTrophyMutation ] = useMutation(MUTATION_REWARD_TROPHY, {
        context: {
            target: LIVE_LINK,
        },
    });
    const rewardTrophy = (user: string, kind: string) => {
        rewardTrophyMutation({
            variables: {
                roomId,
                user,
                kind,
            },
        });

    };
    const items = [
        {
            id: `1`,
            title: `Screenshare`,
            icon: <ScreenShareIcon size="1.7rem" />,
            variant: `blue`,
            isActive: activeGlobalScreenshare,
            onClick: () => {setActiveGlobalScreenshare(!activeGlobalScreenshare); setPinnedUser(undefined);},
        },
        {
            id: `3`,
            type: `divider`,
        },
        {
            id: `4`,
            title: `Mute All`,
            icon: <MicFillIcon size="1.4rem" />,
            activeIcon: <MicDisabledIcon size="1.4rem" />,
            variant: `blue`,
            isActive: activeGlobalMuteAudio,
            onClick: () => setActiveGlobalMuteAudio(!activeGlobalMuteAudio),
        },
        {
            id: `5`,
            title: `Hide all cameras`,
            icon: <CameraVideoFillIcon size="1.4rem" />,
            activeIcon: <CameraDisabledIcon size="1.4rem" />,
            variant: `blue`,
            isActive: activeGlobalMuteVideo,
            onClick: () => setActiveGlobalMuteVideo(!activeGlobalMuteVideo),
        },
        {
            id: `6`,
            type: `divider`,
        },
        {
            id: `7`,
            title: `Send trophy`,
            icon: <TrophyFillIcon size="1.4rem" />,
            onClick: () => rewardTrophy(sessionId, `trophy`),
        },
        {
            id: `8`,
            title: `Send thumbs up`,
            icon: <HandThumbsUpFillIcon size="1.4rem" />,
            onClick: () => rewardTrophy(sessionId, `great_job`),
        },
        {
            id: `9`,
            title: `Send star`,
            icon: <StarFillIcon size="1.4rem" />,
            onClick: () => rewardTrophy(sessionId, `star`),
        },
        {
            id: `10`,
            title: `Send heart`,
            icon: <HeartFillIcon size="1.4rem" />,
            onClick: () => rewardTrophy(sessionId, `heart`),
            variant: `red`,
        },
    ];

    return (
        <StyledPopper
            open={isGlobalActionsOpen}
            anchorEl={anchor}>
            <Grid
                container
                alignItems="stretch"
                className={classes.root}>
                {items.map((item) => (
                    <GlobalActionsMenuItem
                        key={item.id}
                        title={item.title}
                        icon={item.icon}
                        activeIcon={item.activeIcon}
                        type={item.type}
                        variant={item.variant}
                        active={item.isActive}
                        onClick={item.onClick}
                    />
                ))}
            </Grid>
        </StyledPopper>
    );
}

export default GlobalActionsMenu;
