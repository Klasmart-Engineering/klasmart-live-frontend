import lightRay from '../../../../assets/img/trophies/lightray2.png';
import React, { CSSProperties } from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';

type Props = {
    children?: React.ReactNode;
    display?: boolean;
    enterDuration: number;
    angle: number;
};

export function Lights (props: Props): JSX.Element {
    const {
        children, display, enterDuration, angle,
    } = props;

    const rotateAngleLeft = 180 - angle;

    const lightRayLeftTransitionStates: Record<TransitionStatus, any> = {
        entering: {
            opacity: 0.7,
            transform: `translate(-100%, 50%) rotate(${rotateAngleLeft}deg)`,
        },
        entered: {
            opacity: 0.7,
            transform: `translate(-100%, 50%) rotate(${rotateAngleLeft}deg)`,
        },
        exiting: {
            opacity: 0.7,
            transform: `translate(-100%, 50%) rotate(180deg)`,
        },
        exited: {
            opacity: 0,
            transform: `translate(-100%, 50%) rotate(180deg)`,
        },
        unmounted: undefined,
    };

    const lightRayRightTransitionStates: Record<TransitionStatus, any> = {
        entering: {
            opacity: 0.7,
            transform: `translate(0%, 50%) rotate(${angle}deg)`,
        },
        entered: {
            opacity: 0.7,
            transform: `translate(0%, 50%) rotate(${angle}deg)`,
        },
        exiting: {
            opacity: 0.7,
            transform: `translate(0%, 50%) rotate(0deg)`,
        },
        exited: {
            opacity: 0,
            transform: `translate(0%, 50%) rotate(0deg)`,
        },
        unmounted: undefined,
    };

    const lightRayInitialStyle: CSSProperties = {
        position: `absolute`,
        bottom: 0,
        transformOrigin: `100% 50%`,
        width: `100%`,

        transition: `transform ${enterDuration}ms ease-in-out, 
                 opacity ${enterDuration}ms ease-in-out`,
        opacity: 0,
    };

    const lightRayLeftInitialStyle = {
        ...lightRayInitialStyle,
        left: 0,
        transform: `translate(-100%, 50%) rotate(180deg)`,
    };

    const lightRayRightInitialStyle = {
        ...lightRayInitialStyle,
        right: 0,
        transform: `translate(0%, 50%) rotate(0deg)`,
    };

    return (
        <Transition
            in={display}
            timeout={enterDuration}>
            { state => (
                <>
                    <img
                        className="lightray-left"
                        style={{
                            ...lightRayLeftInitialStyle,
                            ...lightRayLeftTransitionStates[state],
                        }}
                        alt="lightray"
                        src={lightRay} />
                    <img
                        className="lightray-right"
                        style={{
                            ...lightRayRightInitialStyle,
                            ...lightRayRightTransitionStates[state],
                        }}
                        alt="lightray"
                        src={lightRay} />
                    {children}
                </>
            )}
        </Transition>
    );
}
