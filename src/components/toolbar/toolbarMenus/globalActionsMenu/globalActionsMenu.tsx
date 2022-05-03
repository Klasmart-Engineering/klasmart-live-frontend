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
import { HandThumbsUpFill as HandThumbsUpFillIcon } from "@styled-icons/bootstrap/HandThumbsUpFill";
import { HeartFill as HeartFillIcon } from "@styled-icons/bootstrap/HeartFill";
import { StarFill as StarFillIcon } from "@styled-icons/bootstrap/StarFill";
import { TrophyFill as TrophyFillIcon } from "@styled-icons/bootstrap/TrophyFill";
import React from "react";
import { useIntl } from "react-intl";
import {
    atom,
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
