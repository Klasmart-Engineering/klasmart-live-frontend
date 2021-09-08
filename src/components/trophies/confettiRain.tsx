import React,
{
    CSSProperties,
    ReactText,
} from 'react';
import Confetti from 'react-confetti';
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';

type Props = {
    children?: React.ReactNode;
    display?: boolean;
    enterDuration: number;
    width: number | undefined;
    height: number | undefined;
};

export function ConfettiRain (props: Props): JSX.Element {
    const {
        children,
        display,
        enterDuration,
        width,
        height,
    } = props;

    const confettiContainerStyle: CSSProperties = {
        position: `absolute`,

        left: 0,
        top: 0,
        width: width,
        height: height,

        transition: `opacity ${enterDuration}ms ease-in-out`,
        opacity: 0,
        zIndex: 2001,
    };

    const confettiTransitionStates: Record<TransitionStatus, any> = {
        entering: {
            opacity: 1,
        },
        entered: {
            opacity: 1,
        },
        exiting: {
            opacity: 0,
        },
        exited: {
            opacity: 0,
        },
        unmounted: undefined,
    };

    return (
        <Transition
            in={display}
            timeout={enterDuration}
            mountOnEnter={true}
            unmountOnExit={true}>
            { state => (
                <div
                    className="trophy-confetti"
                    style={{
                        ...confettiContainerStyle,
                        ...confettiTransitionStates[state],
                    }}>
                    <Confetti
                        width={width}
                        height={height}
                        recycle={false}
                        numberOfPieces={200}/>
                    {children}
                </div>
            )}
        </Transition>
    );
}
