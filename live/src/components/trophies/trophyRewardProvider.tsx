import { useMutation, useSubscription } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import React, { createContext, FunctionComponent, ReactChild, ReactChildren, useCallback, useContext } from 'react';
import { UserContext } from '../../entry';

interface ITrophyContext {
    actions: any;
}

const Context = createContext<ITrophyContext>({
    actions: {},
});

const SUBSCRIBE_ROOM_TROPHY = gql`
  subscription room($roomId: ID!, $name: String) {
    room(roomId: $roomId, name: $name) {
        trophy { userId }
    }
  }
`;

const MUTATION_REWARD_TROPHY = gql`
  mutation rewardTrophy($roomId: ID!, $userId: ID!) {
    rewardTrophy(roomId: $roomId, userId: $userId)
  }
`;

type Props = {
    children?: ReactChild | ReactChildren | null;
}

export const TrophyRewardProvider: FunctionComponent<Props> = ({ children }: Props): JSX.Element => {
    const { roomId, name } = useContext(UserContext);

    const [rewardTrophyMutation] = useMutation(MUTATION_REWARD_TROPHY);

    useSubscription(SUBSCRIBE_ROOM_TROPHY, {
        onSubscriptionData: ({ subscriptionData: { data: { room } } }) => {
            const { trophy } = room;
            if (trophy) {
                console.log(trophy);
                // TODO: Trigger trophy display.
            }
        }, variables: { roomId, name }
    });

    const rewardTrophy = useCallback((userId: string) => {
        rewardTrophyMutation({ variables: { roomId, userId } });
    }, [roomId, rewardTrophyMutation]);

    const actions = {
        rewardTrophy
    }

    return (
        <Context.Provider value={{ actions }}>
            {children}
        </Context.Provider>
    )
}

export function useTrophyReward(): ITrophyContext {
    return useContext(Context);
}

export default useTrophyReward;
