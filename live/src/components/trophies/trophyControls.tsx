import Grid from '@material-ui/core/Grid/Grid';
import IconButton from '@material-ui/core/IconButton/IconButton';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';
import React, { ReactChild, ReactChildren, useCallback, useContext } from 'react';
import { getRandomKind } from './trophyKind';

import { Star as StarIcon } from "@styled-icons/material/Star";
import { EmojiEvents as TrophyIcon } from "@styled-icons/material/EmojiEvents";
import { Favorite as HeartIcon } from "@styled-icons/material/Favorite";
import { ThumbUp as EncourageIcon } from "@styled-icons/material/ThumbUp";
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { UserContext } from '../../entry';

type Props = {
    children?: ReactChild | ReactChildren | null
    otherUserId: string
}

const MUTATION_REWARD_TROPHY = gql`
  mutation rewardTrophy($roomId: ID!, $user: ID!, $kind: String) {
    rewardTrophy(roomId: $roomId, user: $user, kind: $kind)
  }
`;


export default function TrophyControls({ children, otherUserId }: Props): JSX.Element {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const { roomId } = useContext(UserContext);
    const [rewardTrophyMutation] = useMutation(MUTATION_REWARD_TROPHY);
    const rewardTrophy = (user: string, kind: string) => rewardTrophyMutation({ variables: { roomId, user, kind } });

    return (
        <Grid container justify="space-evenly" alignItems="center" item xs={12}>
            <Grid item>
                <IconButton
                    aria-label="control star reward"
                    component="span"
                    onClick={() => rewardTrophy(otherUserId, "star")}
                    size="small"
                >
                    <StarIcon size={isSmDown ? "1rem" : "1.25rem"} color="#0E78D5" />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    aria-label="control trophy reward"
                    component="span"
                    onClick={() => rewardTrophy(otherUserId, "trophy")}
                    size="small"
                >
                    <TrophyIcon size={isSmDown ? "1rem" : "1.25rem"} color="#0E78D5" />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    aria-label="control heart reward"
                    component="span"
                    onClick={() => rewardTrophy(otherUserId, "heart")}
                    size="small"
                >
                    <HeartIcon size={isSmDown ? "1rem" : "1.25rem"} color="#0E78D5" />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    aria-label="control trophy reward"
                    component="span"
                    onClick={() => rewardTrophy(otherUserId, getRandomKind(["awesome", "looks_great", "well_done", "great_job"]))}
                    size="small"
                >
                    <EncourageIcon size={isSmDown ? "1rem" : "1.25rem"} color="#0E78D5" />
                </IconButton>
            </Grid>
            {children}
        </Grid>
    );
}