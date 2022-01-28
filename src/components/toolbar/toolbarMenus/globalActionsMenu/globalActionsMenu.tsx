import GlobalActionsMenuItem,
{ GlobaActionsMenuItem } from "./globalAction";
import { useRewardTrophyMutation } from "@/data/live/mutations/useRewardTrophyMutation";
import { useConferenceContext } from "@/providers/room/conferenceContext";
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
import React from "react";
import { useIntl } from "react-intl";
import { useRecoilValue } from "recoil";

const useStyles = makeStyles(() => ({
    root: {
        padding: 4,
    },
}));

interface GlobaActionsMenuProps {
	anchor: HTMLElement;
}

function GlobalActionsMenu (props: GlobaActionsMenuProps) {
    const { anchor } = props;
    const classes = useStyles();
    const intl = useIntl();

    const isGlobalActionsOpen = useRecoilValue(isGlobalActionsOpenState);

    const {
        audioGloballyMuted,
        videoGloballyMuted,
        setGlobalMuteAudio,
        setGlobalMuteVideo,
    } = useConferenceContext();
    const { roomId, sessionId } = useSessionContext();

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

    const items: GlobaActionsMenuItem[] = [
        {
            title: intl.formatMessage({
                id: audioGloballyMuted ? `toggle_all_microphones_on` : `toggle_all_microphones_off`,
            }),
            icon: <MicFillIcon size="1.4rem" />,
            activeIcon: <MicDisabledIcon size="1.4rem" />,
            variant: `blue`,
            active: audioGloballyMuted,
            onClick: () => setGlobalMuteAudio?.(!audioGloballyMuted),
        },
        {
            title: intl.formatMessage({
                id: videoGloballyMuted ? `toggle_all_cameras_on` : `toggle_all_cameras_off`,
            }),
            icon: <CameraVideoFillIcon size="1.4rem" />,
            activeIcon: <CameraDisabledIcon size="1.4rem" />,
            variant: `blue`,
            active: videoGloballyMuted,
            onClick: () => setGlobalMuteVideo?.(!videoGloballyMuted),
        },
        {
            type: `divider` as const,
        },
        {
            title: intl.formatMessage({
                id: `give_trophy`,
            }),
            icon: <TrophyFillIcon size="1.4rem" />,
            onClick: () => rewardTrophy(sessionId, `trophy`),
        },
        {
            title: intl.formatMessage({
                id: `encourage`,
            }),
            icon: <HandThumbsUpFillIcon size="1.4rem" />,
            onClick: () => rewardTrophy(sessionId, `great_job`),
        },
        {
            title: intl.formatMessage({
                id: `give_star`,
            }),
            icon: <StarFillIcon size="1.4rem" />,
            onClick: () => rewardTrophy(sessionId, `star`),
        },
        {
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
            anchorEl={anchor}
        >
            <Grid
                container
                alignItems="stretch"
                className={classes.root}
            >
                {items.map((item, i) => (
                    <GlobalActionsMenuItem
                        key={`global-action-${i}`}
                        title={item.title}
                        icon={item.icon}
                        activeIcon={item.activeIcon}
                        type={item.type}
                        variant={item.variant}
                        active={item.active}
                        onClick={item.onClick}
                    />
                ))}
            </Grid>
        </StyledPopper>
    );
}

export default GlobalActionsMenu;
