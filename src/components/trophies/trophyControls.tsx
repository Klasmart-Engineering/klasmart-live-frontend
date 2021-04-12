import { useMutation } from '@apollo/client';
import Grid from '@material-ui/core/Grid/Grid';
import IconButton from '@material-ui/core/IconButton/IconButton';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import { EmojiEvents as TrophyIcon } from "@styled-icons/material/EmojiEvents";
import { Favorite as HeartIcon } from "@styled-icons/material/Favorite";
import { Star as StarIcon } from "@styled-icons/material/Star";
import { ThumbUp as EncourageIcon } from "@styled-icons/material/ThumbUp";
import React, { ReactChild, ReactChildren, useContext } from 'react';
import StyledIcon from "../../components/styled/icon";
import { LIVE_LINK, LocalSessionContext } from '../../entry';
import { MUTATION_REWARD_TROPHY } from '../../webRTCState';
import { getRandomKind } from './trophyKind';

type Props = {
    children?: ReactChild | ReactChildren | null
    otherUserId: string
}

export default function TrophyControls({ children, otherUserId }: Props): JSX.Element {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const { roomId } = useContext(LocalSessionContext);
    const [rewardTrophyMutation] = useMutation(MUTATION_REWARD_TROPHY, {context: {target: LIVE_LINK}});
    const rewardTrophy = (user: string, kind: string) => rewardTrophyMutation({ variables: { roomId, user, kind } });

    return (
        <Grid container justify="space-between" alignItems="center" item xs={12}>
            <Grid item>
                <IconButton
                    aria-label="control star reward"
                    component="span"
                    onClick={() => rewardTrophy(otherUserId, "star")}
                    size="small"
                >
                    <StyledIcon
                        icon={<StarIcon />}
                        size={isSmDown ? "small" : "medium"}
                        color="#0E78D5"
                    />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    aria-label="control trophy reward"
                    component="span"
                    onClick={() => rewardTrophy(otherUserId, "trophy")}
                    size="small"
                >
                    <StyledIcon
                        icon={<TrophyIcon />}
                        size={isSmDown ? "small" : "medium"}
                        color="#0E78D5"
                    />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    aria-label="control heart reward"
                    component="span"
                    onClick={() => rewardTrophy(otherUserId, "heart")}
                    size="small"
                >
                    <StyledIcon
                        icon={<HeartIcon />}
                        size={isSmDown ? "small" : "medium"}
                        color="#0E78D5"
                    />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    aria-label="control trophy reward"
                    component="span"
                    onClick={() => rewardTrophy(otherUserId, getRandomKind(["awesome", "looks_great", "well_done", "great_job"]))}
                    size="small"
                >
                    <StyledIcon
                        icon={<EncourageIcon />}
                        size={isSmDown ? "small" : "medium"}
                        color="#0E78D5"
                    />
                </IconButton>
            </Grid>
            {children}
        </Grid>
    );
}