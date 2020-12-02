import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';

import { Lights } from './lights';
import { Reward } from './reward';
import TIMINGS from './trophyTimings';
import TrophyKinds, { TrophyKind, getRandomKind } from './trophyKind';

import useSound from 'use-sound';
import { ConfettiRain } from './confettiRain';
import { RoomContext } from '../../pages/room/room';

export type Trophy = { from: string, user: string, kind: string };

type Props = {
    children?: React.ReactNode;
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

    zIndex: 2000,
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


function locationOfElement(elementId?: string): { x: number | string, y: number | string } {
    if (!elementId) return CenteredLocation;

    const element = document.getElementById(elementId)
    if (!element) return CenteredLocation;

    const rect = element.getBoundingClientRect();

    if (rect.width === 0 && rect.height === 0)
        return CenteredLocation;

    return {
        x: rect.x + (rect.right - rect.left) / 2,
        y: rect.y + (rect.bottom - rect.top) / 2,
    }
}

export function Trophy(props: Props): JSX.Element {
    const { children } = props;
    const room = RoomContext.Consume()

    const [display, setDisplay] = useState(false);
    const [showLights, setShowLights] = useState(false);
    const [showReward, setShowReward] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [withAudio, setWithAudio] = useState(false);

    const [containerWidth, setContainerWidth] = useState<number>(0);
    const [containerHeight, setContainerHeight] = useState<number>(0);
    const [lightAngle, setLightAngle] = useState<number>(45);

    const [appearAt, setAppearAt] = useState<RewardLocation>(CenteredLocation);
    const [disappearAt, setDisappearAt] = useState<RewardLocation>(CenteredLocation);

    const [trophyKind, setTrophyKind] = useState<TrophyKind>(TrophyKinds.trophy)

    const [play] = useSound(trophyKind.audio);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleTrophy(trophy: Trophy) {
            setWithAudio(trophy.from === trophy.user);

            setAppearAt(locationOfElement(`participant:${trophy.from}`));

            setDisappearAt(locationOfElement(trophy.from !== trophy.user ? `participant:${trophy.user}` : undefined));

            if (TrophyKinds[trophy.kind]) {
                setTrophyKind(TrophyKinds[trophy.kind]);
            }

            setDisplay(true);
        }

        room.emitter.addListener("trophy", handleTrophy)
        return () => { room.emitter.removeListener("trophy", handleTrophy) }
    }, [room.emitter, setAppearAt, setDisappearAt, setDisplay])



    useEffect(() => {
        if (!containerRef.current || !display) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        setContainerWidth(width);
        setContainerHeight(height);

        const angleDegrees = Math.atan2(height, width) * 180 / Math.PI;

        setLightAngle(angleDegrees);

    }, [containerRef, display])

    const entering = useCallback(() => {
        if (withAudio) play();
    }, [play, withAudio]);

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

        if (trophyKind.confetti) {
            setTimeout(() => {
                setShowConfetti(true);
            }, TIMINGS.confetti.displayAfter);

            const hideConfettiAfter = TIMINGS.confetti.displayAfter + TIMINGS.confetti.displayDuration;
            setTimeout(() => {
                setShowConfetti(false);
            }, hideConfettiAfter);
        }
    }, [setDisplay, setShowReward, trophyKind]);

    return (
        <div style={{ pointerEvents: "none" }}>
            <Transition in={display} timeout={TIMINGS.enterDuration} onEntering={entering} onEntered={entered} mountOnEnter={true} unmountOnExit={true}>
                {state => (
                    <div ref={containerRef} className="trophy-container" style={{ ...containerStyle, ...containerTransitionStates[state] }}>
                        <Lights display={showLights} enterDuration={TIMINGS.lights.enterDuration} angle={lightAngle} />
                        <Reward
                            display={showReward}
                            enterDuration={TIMINGS.reward.enterDuration}
                            leaveDuration={TIMINGS.reward.leaveDuration}
                            enterLocation={appearAt}
                            exitLocation={disappearAt}
                            kind={trophyKind}
                        />
                        {children}
                    </div>
                )}
            </Transition>
            <ConfettiRain display={showConfetti} width={containerWidth} height={containerHeight} enterDuration={TIMINGS.confetti.enterDuration} />
        </div>
    )
}