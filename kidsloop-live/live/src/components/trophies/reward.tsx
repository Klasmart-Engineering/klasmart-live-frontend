import React, { CSSProperties } from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';
import { TrophyKind } from './trophyKind';

type Props = {
    children?: React.ReactNode;
    display?: boolean;
    enterDuration: number;
    enterLocation: { x: number | string, y: number | string };
    exitLocation: { x: number | string, y: number | string };
    kind: TrophyKind;
};

export function Reward(props: Props): JSX.Element {
    const { children, display, enterDuration, enterLocation, exitLocation, kind } = props;

    const rewardStyle: CSSProperties = {
        position: 'absolute',

        left: enterLocation.x,
        top: enterLocation.y,
        transform: 'translate(-50%, -50%) scale(0)',

        transition: `transform ${enterDuration}ms ease-in-out, 
                     top ${enterDuration}ms ease-in-out, 
                     left ${enterDuration}ms ease-in-out`,
    }

    const rewardTransitionStates: Record<TransitionStatus, any> = {
        entering: { transform: `translate(-50%, -50%) scale(0.8)`, left: '50%', top: '50%' },
        entered: { transform: 'translate(-50%, -50%) scale(1.0)', left: '50%', top: '50%' },
        exiting: { transform: `translate(-50%, -50%) scale(0)`, left: exitLocation.x, top: exitLocation.y },
        exited: { transform: `translate(-50%, -50%) scale(0)`, left: enterLocation.x, top: enterLocation.y },
        unmounted: undefined,
    }

    return (
        <Transition in={display} timeout={enterDuration}>
            { state => (
                <div className="trophy-reward" style={{ ...rewardStyle, ...rewardTransitionStates[state] }}>
                    <img alt="trophy" style={{...kind.style}} src={kind.image} />
                    {children}
                </div>
            )}
        </Transition>
    );
}