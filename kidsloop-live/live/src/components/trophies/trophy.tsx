import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';

import { Lights } from './lights';
import { Reward } from './reward';
import TIMINGS from './trophyTimings';

import rewardSound from '../../assets/audio/trophies/reward1.mp3';
import useSound from 'use-sound';

type Props = {
    children?: React.ReactNode;
    appearAtId?: string;
    disappearAtId?: string;
};

const containerStyle: CSSProperties = {
    background: 'rgba(0.0, 0.0, 0.0, 0.25)',
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',

    transition: `opacity ${TIMINGS.enterDuration}ms ease-in-out`,
    opacity: 0,
}

const containerTransitionStates: Record<TransitionStatus, any> = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
    unmounted: undefined,
}

type RewardLocation = {
    x: number | string,
    y: number | string,
}

const CenteredLocation = {
    x: '50%',
    y: '50%',
}

export function Trophy(props: Props): JSX.Element {
    const { children, appearAtId, disappearAtId } = props;

    const [display, setDisplay] = useState(false);
    const [showLights, setShowLights] = useState(false);
    const [showReward, setShowReward] = useState(false);

    const [lightAngle, setLightAngle] = useState<number>(45);

    const [appearAt, setAppearAt] = useState<RewardLocation>(CenteredLocation);
    const [disappearAt, setDisappearAt] = useState<RewardLocation>(CenteredLocation);

    const [play] = useSound(rewardSound);

    const containerRef = useRef<HTMLDivElement>(null);

    const locationOfElementWithId = function (elementId?: string): { x: number | string, y: number | string } {
        if (!elementId) return CenteredLocation;

        const element = document.getElementById(elementId);
        if (!element) return CenteredLocation;

        const rect = element.getBoundingClientRect();

        return {
            x: rect.x,
            y: rect.y,
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', (evt) => {
            if (evt.code === 'KeyT') {
                setAppearAt(locationOfElementWithId(appearAtId));
                setDisappearAt(locationOfElementWithId(disappearAtId));
                setDisplay(true);
            }
        });
    }, []);

    useEffect(() => {
        if (!containerRef.current || !display) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const angleDegrees = Math.atan2(height, width) * 180 / Math.PI;

        console.log(angleDegrees);

        setLightAngle(angleDegrees);

    }, [containerRef, display])

    const entering = useCallback(() => {
        play();
    }, [play]);

    const entered = useCallback(() => {
        setTimeout(() => {
            setShowLights(true);
        }, TIMINGS.lights.displayAfter);

        setTimeout(() => {
            setShowReward(true)
        }, TIMINGS.reward.displayAfter);

        const hideLightsAfter = TIMINGS.lights.displayAfter + TIMINGS.lights.displayDuration;
        setTimeout(() => {
            setShowLights(false)
        }, hideLightsAfter);


        const hideRewardAfter = TIMINGS.reward.displayAfter + TIMINGS.reward.displayDuration;
        setTimeout(() => {
            setShowReward(false)
        }, hideRewardAfter);

        setTimeout(() => {
            setDisplay(false);
        }, TIMINGS.displayDuration);
    }, [setDisplay, setShowReward]);

    return (
        <Transition in={display} timeout={TIMINGS.enterDuration} onEntering={entering} onEntered={entered} mountOnEnter={true} unmountOnExit={true}>
            { state => (
                <div ref={containerRef} className="trophy-container" style={{ ...containerStyle, ...containerTransitionStates[state] }}>
                    <Lights display={showLights} enterDuration={TIMINGS.lights.enterDuration} angle={lightAngle} />
                    <Reward
                        display={showReward}
                        enterDuration={TIMINGS.reward.enterDuration}
                        enterLocation={appearAt}
                        exitLocation={disappearAt}
                    />
                    {children}
                </div>
            )}
        </Transition>
    )
}