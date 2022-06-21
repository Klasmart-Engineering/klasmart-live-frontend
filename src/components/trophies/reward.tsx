import { TrophyKind } from './trophyKind';
import { useSessionContext } from '@/providers/session-context';
import { ClassType } from '@/store/actions';
import {
    useMediaQuery,
    useTheme,
} from '@mui/material';
import React from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';

type Props = {
    children?: React.ReactNode;
    display?: boolean;
    enterDuration: number;
    leaveDuration: number;
    enterLocation: { x: number | string; y: number | string };
    exitLocation: { x: number | string; y: number | string };
    kind: TrophyKind;
};

export function Reward (props: Props): JSX.Element {
    const {
        children,
        display,
        enterDuration,
        leaveDuration,
        enterLocation,
        exitLocation,
        kind,
    } = props;

    const { classType } = useSessionContext();

    const rewardStyle: React.CSSProperties = {
        position: `absolute`,

        left: enterLocation.x,
        top: enterLocation.y,
        transform: `translate(-50%, -50%) scale(0)`,

        transition: `transform ${enterDuration}ms ease-in-out, 
                     top ${enterDuration}ms ease-in-out, 
                     left ${enterDuration}ms ease-in-out`,
    };

    let exitingExitedState: any = {};
    if (exitLocation.x !== `50%` && exitLocation.y !== `50%`) {
        exitingExitedState = {
            exiting: {
                transform: `translate(-50%, -50%) scale(0.2)`,
                left: exitLocation.x,
                top: exitLocation.y,
            },
            exited: {
                transform: `translate(-50%, -50%) scale(0)`,
                left: exitLocation.x,
                top: exitLocation.y,
            },
        };
    } else {
        exitingExitedState = {
            exiting: {
                transform: `translate(-50%, -50%) scale(0.0)`,
                left: `50%`,
                top: `50%`,
            },
            exited: {
                transform: `translate(-50%, -50%) scale(0)`,
                left: `50%`,
                top: `50%`,
            },
        };
    }

    const rewardTransitionStates: Record<TransitionStatus, any> = {
        entering: {
            transform: `translate(-50%, -50%) scale(0.0)`,
            left: enterLocation.x,
            top: enterLocation.y,
        },
        entered: {
            transform: `translate(-50%, -50%) scale(1.0)`,
            left: `50%`,
            top: `50%`,
        },
        exiting: exitingExitedState.exiting,
        exited: exitingExitedState.exited,
        unmounted: undefined,
    };

    const isGreatJob = kind.name === `Great Job`;
    if(isGreatJob && classType === ClassType.STUDY) {
        const theme = useTheme();
        const isMdDown = useMediaQuery(theme.breakpoints.down(`md`));
        rewardStyle.top = isMdDown ? `36%` : `25%`;
        kind.style.width = isMdDown ? 400 : `auto`;
        delete rewardTransitionStates.exiting.top;
        delete rewardTransitionStates.exited.top;
        delete rewardTransitionStates.entering.top;
        delete rewardTransitionStates.entered.top;
    }

    const timeout = {
        appear: 0,
        enter: enterDuration,
        exit: leaveDuration,
    };

    return (
        <Transition
            in={display}
            timeout={timeout}
        >
            { state => (
                <div
                    className="trophy-reward"
                    style={{
                        ...rewardStyle,
                        ...rewardTransitionStates[state],
                    }}
                >
                    <img
                        alt="trophy"
                        style={{
                            ...kind.style,
                        }}
                        src={kind.image}
                    />
                    {children}
                </div>
            )}
        </Transition>
    );
}
