import GlobalActionsMenuItem from "./globalAction";
import { useRewardTrophyMutation } from "@/data/live/mutations/useRewardTrophyMutation";
import { useContent } from "@/data/live/state/useContent";
import { ContentType } from "@/pages/utils";
import { useConferenceContext } from "@/providers/room/conferenceContext";
import { ScreenShareContext } from "@/providers/screenShareProvider";
import { useSessionContext } from "@/providers/session-context";
import { isGlobalActionsOpenState } from "@/store/layoutAtoms";
import { StyledPopper } from "@/utils/utils";
import {
    Grid,
    makeStyles,
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
{ useContext } from "react";
import { isMobile } from "react-device-detect";
import { useIntl } from "react-intl";
import { useRecoilValue } from "recoil";

const useStyles = makeStyles(() => ({
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

    const isGlobalActionsOpen = useRecoilValue(isGlobalActionsOpenState);

    const {
        audioGloballyMuted,
        videoGloballyMuted,
        toggleAudioStates,
        toggleVideoStates,
    } = useConferenceContext();
    const { roomId, sessionId } = useSessionContext();
    const content = useContent();
    const screenShare = useContext(ScreenShareContext);

    const [ rewardTrophyMutation ] = useRewardTrophyMutation();

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
                id: audioGloballyMuted ? `toggle_all_microphones_off` : `toggle_all_microphones_on`,
            }),
            icon: <MicFillIcon size="1.4rem" />,
            activeIcon: <MicDisabledIcon size="1.4rem" />,
            variant: `blue`,
            isActive: audioGloballyMuted,
            onClick: () => toggleAudioStates?.(),
        },
        {
            id: `5`,
            title: intl.formatMessage({
                id: videoGloballyMuted ? `toggle_all_cameras_off` : `toggle_all_cameras_on`,
            }),
            icon: <CameraVideoFillIcon size="1.4rem" />,
            activeIcon: <CameraDisabledIcon size="1.4rem" />,
            variant: `blue`,
            isActive: videoGloballyMuted,
            onClick: () => toggleVideoStates?.(),
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
