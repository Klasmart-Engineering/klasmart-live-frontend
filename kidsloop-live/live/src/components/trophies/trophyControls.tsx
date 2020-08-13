import Grid from '@material-ui/core/Grid/Grid';
import IconButton from '@material-ui/core/IconButton/IconButton';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import React, { ReactChild, ReactChildren, useCallback } from 'react';
import useTrophyReward from './trophyRewardProvider';
import { Star as TrophyStarIcon } from "@styled-icons/material/Star";
import { EmojiEvents as TrophyIcon } from "@styled-icons/material/EmojiEvents";

type Props = {
    children?: ReactChild | ReactChildren | null
    otherUserId: string
}

export default function TrophyControls({ children, otherUserId }: Props): JSX.Element {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const { actions: { rewardTrophy } } = useTrophyReward();

    const rewardStarOnClick = useCallback(() => {
        if (!rewardTrophy) return;

        rewardTrophy(otherUserId, "default");
    }, [otherUserId, rewardTrophy]);

    const rewardHeartOnClick = useCallback(() => {
        if (!rewardTrophy) return;

        rewardTrophy(otherUserId, "heart2");
    }, [otherUserId, rewardTrophy]);

    return (
        <Grid container justify="space-evenly" alignItems="center" item xs={6}>
            <Grid item>
                <IconButton
                    aria-label="control trophy reward"
                    component="span"
                    onClick={rewardStarOnClick}
                    size="small"
                >
                    <TrophyStarIcon size={isSmDown ? "1rem" : "1.25rem"} color="#0E78D5" />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    aria-label="control trophy reward"
                    component="span"
                    onClick={rewardHeartOnClick}
                    size="small"
                >
                    <TrophyIcon size={isSmDown ? "1rem" : "1.25rem"} color="#0E78D5" />
                </IconButton>
            </Grid>
            {children}
        </Grid>
    );
}