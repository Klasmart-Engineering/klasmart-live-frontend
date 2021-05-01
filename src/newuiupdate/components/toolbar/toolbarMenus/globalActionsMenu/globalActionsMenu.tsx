import { ContentType } from "../../../../../pages/room/room";
import {
    LIVE_LINK, LocalSessionContext, SFU_LINK,
} from "../../../../providers/providers";
import { RoomContext } from "../../../../providers/roomContext";
import { ScreenShareContext } from "../../../../providers/screenShareProvider";
import {
    GLOBAL_MUTE_MUTATION, GLOBAL_MUTE_QUERY, GlobalMuteNotification, WebRTCContext,
} from "../../../../providers/WebRTCContext";
import {
    isActiveGlobalMuteAudioState,
    isActiveGlobalMuteVideoState,
    isGlobalActionsOpenState,
    pinnedUserState,
    videoGloballyMutedState,
} from "../../../../states/layoutAtoms";
import { MUT_SHOW_CONTENT, MUTATION_REWARD_TROPHY } from "../../../utils/graphql";
import { StyledPopper } from "../../../utils/utils";
import GlobalActionsMenuItem from "./globalAction";
import { useMutation, useQuery } from "@apollo/client";
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
import React, {
    useContext, useEffect, useState,
} from "react";
import { useIntl } from "react-intl";
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
    const intl = useIntl();

    const [ isGlobalActionsOpen, setIsGlobalActionsOpen ] = useRecoilState(isGlobalActionsOpenState);
    const [ activeGlobalMuteAudio, setActiveGlobalMuteAudio ] = useRecoilState(isActiveGlobalMuteAudioState);
    const [ activeGlobalMuteVideo, setActiveGlobalMuteVideo ] = useRecoilState(isActiveGlobalMuteVideoState);
    const [ videoGloballyMuted, setVideoGloballyMuted ] = useRecoilState(videoGloballyMutedState);

    const [ pinnedUser, setPinnedUser ] = useRecoilState(pinnedUserState);
    const [ camerasOn, setCamerasOn ] = useState(true);
    const [ micsOn, setMicsOn ] = useState(true);
    const { roomId, sessionId } = useContext(LocalSessionContext);
    const { content, sessions } = useContext(RoomContext);
    const screenShare = useContext(ScreenShareContext);
    const webrtc = useContext(WebRTCContext);

    const localSession = sessions.get(sessionId);

    const [ globalMuteMutation ] = useMutation(GLOBAL_MUTE_MUTATION, {
        context: {
            target: SFU_LINK,
        },
    });
    const { refetch: refetchGlobalMute } = useQuery(GLOBAL_MUTE_QUERY, {
        variables: {
            roomId,
        },
        context: {
            target: SFU_LINK,
        },
    });

    const [ showContent, { loading: loadingShowContent } ] = useMutation(MUT_SHOW_CONTENT, {
        context: {
            target: LIVE_LINK,
        },
    });
    const [ rewardTrophyMutation, { loading: loadingTrophy } ] = useMutation(MUTATION_REWARD_TROPHY, {
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

    const toggleScreenshare = () => {
        if(content?.type === ContentType.Screen) {
            screenShare.stop();
        }else{
            screenShare.start();
        }
        setPinnedUser(undefined);
    };

    const enforceGlobalMute = async () => {
        const { data } = await refetchGlobalMute();
        const videoGloballyDisabled = data?.retrieveGlobalMute?.videoGloballyDisabled;
        setCamerasOn(!videoGloballyDisabled);
        // if (videoGloballyDisabled) {
        //     toggleVideoStates(videoGloballyDisabled);
        // }
        // const audioGloballyMuted = data?.retrieveGlobalMute?.audioGloballyMuted;
        // if (audioGloballyMuted) {
        //     toggleAudioStates(audioGloballyMuted);
        // }
    };

    useEffect(() => {
        enforceGlobalMute();
    }, [
        roomId,
        localSession?.isHost,
        webrtc?.inboundStreams.size,
    ]);

    async function toggleVideoStates (isOn?: boolean) {

        const notification: GlobalMuteNotification = {
            roomId,
            audioGloballyMuted: undefined,
            videoGloballyDisabled: isOn ?? camerasOn,
        };
        const data = await globalMuteMutation({
            variables: notification,
        });
        const videoGloballyDisabled = data?.data?.updateGlobalMute?.videoGloballyDisabled;
        if (videoGloballyDisabled != null) {
            setCamerasOn(!videoGloballyDisabled);
            setVideoGloballyMuted(!videoGloballyDisabled);
        }

        setVideoGloballyMuted(!videoGloballyMuted);
    }

    async function toggleAudioStates (isOn?: boolean) {
        const notification: GlobalMuteNotification = {
            roomId,
            audioGloballyMuted: isOn ?? micsOn,
            videoGloballyDisabled: undefined,
        };
        const data = await globalMuteMutation({
            variables: notification,
        });
        const audioGloballyMuted = data?.data?.updateGlobalMute?.audioGloballyMuted;
        if (audioGloballyMuted != null) {
            setMicsOn(!audioGloballyMuted);
        }
    }

    const items = [
        {
            id: `1`,
            title: intl.formatMessage({
                id: content?.type === ContentType.Screen ? `toolbar_global_actions_turn_of_screenshare` : `toolbar_global_actions_turn_on_screenshare`,
            }),
            icon: <ScreenShareIcon size="1.7rem" />,
            variant: `blue`,
            isActive: content?.type === ContentType.Screen,
            onClick: () => {toggleScreenshare();},
        },
        {
            id: `3`,
            type: `divider`,
        },
        {
            id: `4`,
            title: intl.formatMessage({
                id: micsOn ? `unmute_all` : `mute_all`,
            }),
            icon: <MicFillIcon size="1.4rem" />,
            activeIcon: <MicDisabledIcon size="1.4rem" />,
            variant: `blue`,
            isActive: !micsOn,
            onClick: () => toggleAudioStates(),
        },
        {
            id: `5`,
            title: intl.formatMessage({
                id: camerasOn ? `set_cameras_on` : `set_cameras_off`,
            }),
            icon: <CameraVideoFillIcon size="1.4rem" />,
            activeIcon: <CameraDisabledIcon size="1.4rem" />,
            variant: `blue`,
            isActive: !camerasOn,
            onClick: () => toggleVideoStates(),
        },
        {
            id: `6`,
            type: `divider`,
        },
        {
            id: `7`,
            title: intl.formatMessage({
                id: `give_trophy`,
            }),
            icon: <TrophyFillIcon size="1.4rem" />,
            onClick: () => rewardTrophy(sessionId, `trophy`),
        },
        {
            id: `8`,
            title: intl.formatMessage({
                id: `encourage`,
            }),
            icon: <HandThumbsUpFillIcon size="1.4rem" />,
            onClick: () => rewardTrophy(sessionId, `great_job`),
        },
        {
            id: `9`,
            title: intl.formatMessage({
                id: `give_star`,
            }),
            icon: <StarFillIcon size="1.4rem" />,
            onClick: () => rewardTrophy(sessionId, `star`),
        },
        {
            id: `10`,
            title: intl.formatMessage({
                id: `give_heart`,
            }),
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
