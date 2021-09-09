import GlobalActionsMenuItem from "./globalAction";
import { ContentType } from "@/pages/utils";
import {
    LIVE_LINK,
    SFU_LINK,
} from "@/providers/providers";
import { RoomContext } from "@/providers/roomContext";
import { ScreenShareContext } from "@/providers/screenShareProvider";
import { useSessionContext } from "@/providers/session-context";
import {
    GLOBAL_MUTE_MUTATION,
    GLOBAL_MUTE_QUERY,
    GlobalMuteNotification,
} from "@/providers/WebRTCContext";
import {
    isGlobalActionsOpenState,
    videoGloballyMutedState,
} from "@/store/layoutAtoms";
import { MUTATION_REWARD_TROPHY } from "@/utils/graphql";
import { StyledPopper } from "@/utils/utils";
import {
    useMutation,
    useQuery,
} from "@apollo/client";
import {
    Grid,
    makeStyles,
    Theme,
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
import React,
{
    useContext,
    useEffect,
    useState,
} from "react";
import { isMobile } from "react-device-detect";
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
    const [ videoGloballyMuted, setVideoGloballyMuted ] = useRecoilState(videoGloballyMutedState);

    const [ camerasOn, setCamerasOn ] = useState(true);
    const [ micsOn, setMicsOn ] = useState(true);
    const { roomId, sessionId } = useSessionContext();
    const { content } = useContext(RoomContext);
    const screenShare = useContext(ScreenShareContext);

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
    };

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
            hidden: isMobile,
        },
        {
            id: `3`,
            type: `divider`,
            hidden: isMobile,
        },
        {
            id: `4`,
            title: intl.formatMessage({
                id: micsOn ? `toggle_all_microphones_off` : `toggle_all_microphones_on`,
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
                id: camerasOn ? `toggle_all_cameras_off` : `toggle_all_cameras_on`,
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

    const fetchGlobalMute = async () => {
        const { data: globalMuteData } = await refetchGlobalMute();
        setMicsOn(!globalMuteData.retrieveGlobalMute.audioGloballyMuted);
        setCamerasOn(!globalMuteData.retrieveGlobalMute.videoGloballyDisabled);
    };

    useEffect(()=>{
        fetchGlobalMute();
    }, []);

    return (
        <StyledPopper
            open={isGlobalActionsOpen}
            anchorEl={anchor}>
            <Grid
                container
                alignItems="stretch"
                className={classes.root}>

                {items.map((item) => (
                    !item.hidden && <GlobalActionsMenuItem
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
