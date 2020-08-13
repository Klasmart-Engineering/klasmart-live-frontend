import Grid from '@material-ui/core/Grid/Grid';
import IconButton from '@material-ui/core/IconButton/IconButton';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import React, { ReactChild, ReactChildren, useCallback } from 'react';
import useTrophyReward from './trophyRewardProvider';
import { Star as StarIcon } from "@styled-icons/material/Star";
import { EmojiEvents as TrophyIcon } from "@styled-icons/material/EmojiEvents";
import { Favorite as HeartIcon } from "@styled-icons/material/Favorite";
import { ThumbUp as EncourageIcon } from "@styled-icons/material/ThumbUp";
import { getRandomKind } from './trophyKind';

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

        rewardTrophy(otherUserId, "star");
    }, [otherUserId, rewardTrophy]);

    const rewardTrophyOnClick = useCallback(() => {
        if (!rewardTrophy) return;

        rewardTrophy(otherUserId, "trophy");
    }, [otherUserId, rewardTrophy]);

    const rewardHeartOnClick = useCallback(() => {
        if (!rewardTrophy) return;

        rewardTrophy(otherUserId, "heart");
    }, [otherUserId, rewardTrophy]);

    const rewardEncourageOnClick = useCallback(() => {
        if (!rewardTrophy) return;
        const kind = getRandomKind(["awesome", "looks_great", "well_done", "great_job"]);
        rewardTrophy(otherUserId, kind);
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
                    <StarIcon size={isSmDown ? "1rem" : "1.25rem"} color="#0E78D5" />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    aria-label="control trophy reward"
                    component="span"
                    onClick={rewardTrophyOnClick}
                    size="small"
                >
                    <TrophyIcon size={isSmDown ? "1rem" : "1.25rem"} color="#0E78D5" />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    aria-label="control trophy reward"
                    component="span"
                    onClick={rewardHeartOnClick}
                    size="small"
                >
                    <HeartIcon size={isSmDown ? "1rem" : "1.25rem"} color="#0E78D5" />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    aria-label="control trophy reward"
                    component="span"
                    onClick={rewardEncourageOnClick}
                    size="small"
                >
                    <EncourageIcon size={isSmDown ? "1rem" : "1.25rem"} color="#0E78D5" />
                </IconButton>
            </Grid>
            {children}
        </Grid>
    );
}