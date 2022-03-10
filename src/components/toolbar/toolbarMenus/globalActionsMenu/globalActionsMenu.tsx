import GlobalActionsMenuItem,
{ GlobaActionsMenuItem } from "./globalAction";
import { useRewardTrophyMutation } from "@/data/live/mutations/useRewardTrophyMutation";
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
import {
    atom,
    useRecoilState,
    useRecoilValue,
} from "recoil";

const useStyles = makeStyles(() => ({
    root: {
        padding: 4,
    },
}));

interface GlobaActionsMenuProps {
	anchor: HTMLElement;
}

export const pauseAllMicrophonesState = atom<boolean>({
    key: `pauseAllMicrophones`,
    default: false,
});

export const pauseAllCamerasState = atom<boolean>({
    key: `pauseAllCameras`,
    default: false,
});

function GlobalActionsMenu (props: GlobaActionsMenuProps) {
    const { anchor } = props;
    const classes = useStyles();
    const intl = useIntl();

    const isGlobalActionsOpen = useRecoilValue(isGlobalActionsOpenState);
    const [ allMicrophonesPaused, setAllMicrophonesPaused ] = useRecoilState(pauseAllMicrophonesState);
    const [ allCamerasPause, setAllCamerasPause ] = useRecoilState(pauseAllCamerasState);

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
            id: `global-action-toggle-all-microphones`,
            title: intl.formatMessage({
                id: allMicrophonesPaused ? `toggle_all_microphones_on` : `toggle_all_microphones_off`,
            }),
            icon: <MicFillIcon size="1.4rem" />,
            activeIcon: <MicDisabledIcon size="1.4rem" />,
            variant: `blue`,
            active: allMicrophonesPaused,
            onClick: () => setAllMicrophonesPaused(x => !x),
        },
        {
            id: `global-action-toggle-all-cameras`,
            title: intl.formatMessage({
                id: allCamerasPause ? `toggle_all_cameras_on` : `toggle_all_cameras_off`,
            }),
            icon: <CameraVideoFillIcon size="1.4rem" />,
            activeIcon: <CameraDisabledIcon size="1.4rem" />,
            variant: `blue`,
            active: allCamerasPause,
            onClick: () => setAllCamerasPause(x => !x),
        },
        {
            type: `divider` as const,
        },
        {
            id: `global-action-give-trophy`,
            title: intl.formatMessage({
                id: `give_trophy`,
            }),
            icon: <TrophyFillIcon size="1.4rem" />,
            onClick: () => rewardTrophy(sessionId, `trophy`),
        },
        {
            id: `global-action-encourage`,
            title: intl.formatMessage({
                id: `encourage`,
            }),
            icon: <HandThumbsUpFillIcon size="1.4rem" />,
            onClick: () => rewardTrophy(sessionId, `great_job`),
        },
        {
            id: `global-action-give-star`,
            title: intl.formatMessage({
                id: `give_star`,
            }),
            icon: <StarFillIcon size="1.4rem" />,
            onClick: () => rewardTrophy(sessionId, `star`),
        },
        {
            id: `global-action-give-heart`,
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
                        id={item.id}
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
