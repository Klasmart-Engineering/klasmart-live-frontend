import { useMutation, useSubscription } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import React, { createContext, FunctionComponent, ReactChild, ReactChildren, useCallback, useContext, useReducer } from 'react';
import { UserContext } from '../../entry';

export type Trophy = { from: string, user: string, kind: string };
export type TrophyHandler = (trophy: Trophy) => void;

interface ITrophyState {
    handlers: TrophyHandler[];
}

interface ITrophyActions {
    rewardTrophy?: (user: string, kind: string) => void,
    registerHandler?: (handler: TrophyHandler) => void,
    removeHandler?: (handler: TrophyHandler) => void,
}

interface ITrophyContext {
    state: ITrophyState;
    actions: ITrophyActions;
}

const Context = createContext<ITrophyContext>({
    state: { handlers: [] },
    actions: {}
});

const SUBSCRIBE_ROOM_TROPHY = gql`
  subscription room($roomId: ID!, $name: String) {
    room(roomId: $roomId, name: $name) {
        trophy { from, user, kind }
    }
  }
`;

const MUTATION_REWARD_TROPHY = gql`
  mutation rewardTrophy($roomId: ID!, $user: ID!, $kind: String) {
    rewardTrophy(roomId: $roomId, user: $user, kind: $kind)
  }
`;

type Props = {
    children?: ReactChild | ReactChildren | null;
}

export const TrophyRewardProvider: FunctionComponent<Props> = ({ children }: Props): JSX.Element => {
    const { roomId, sessionId } = useContext(UserContext);

    const [rewardTrophyMutation] = useMutation(MUTATION_REWARD_TROPHY);

    const [handlers, handlersDispatch] = useReducer((state: TrophyHandler[], action: { type: 'register' | 'remove', handler: TrophyHandler }) => {
        switch (action.type) {
            case 'register':
                state.push(action.handler);
                break;
            case 'remove':
                const index = state.indexOf(action.handler);
                if (index !== -1) state.splice(index, 1);
                break;
            default: throw new Error('invalid action');
        }

        return state;
    }, []);

    const invokeTrophyHandlers = useCallback((trophy: Trophy) => {
        handlers.forEach((handler) => {
            handler(trophy);
        });
    }, [handlers])

    useSubscription(SUBSCRIBE_ROOM_TROPHY, {
        onSubscriptionData: ({ subscriptionData: { data: { room } } }) => {
            const { trophy } = room;
            if (trophy) {
                invokeTrophyHandlers(trophy);
            }
        }, variables: { roomId, name }
    });

    const rewardTrophy = useCallback((user: string, kind: string) => {
        rewardTrophyMutation({ variables: { roomId, user, kind } });

        const trophy = {
            from: sessionId,
            user,
            kind,
        }

        invokeTrophyHandlers(trophy)
    }, [roomId, rewardTrophyMutation]);

    const registerHandler = useCallback((handler: TrophyHandler) => {
        handlersDispatch({ type: 'register', handler })
    }, [handlersDispatch]);

    const removeHandler = useCallback((handler: TrophyHandler) => {
        handlersDispatch({ type: 'remove', handler })
    }, [handlersDispatch]);

    const actions = {
        rewardTrophy,
        registerHandler,
        removeHandler,
    }

    return (
        <Context.Provider value={{ actions, state: { handlers } }}>
            {children}
        </Context.Provider>
    )
}

export function useTrophyReward(): ITrophyContext {
    return useContext(Context);
}

export default useTrophyReward;
