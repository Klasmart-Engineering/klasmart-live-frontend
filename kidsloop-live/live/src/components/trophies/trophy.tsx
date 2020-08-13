import React, { CSSProperties, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Transition } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';

import { Lights } from './lights';
import { Reward } from './reward';
import TIMINGS from './trophyTimings';
import TrophyKinds, { TrophyKind, getRandomKind } from './trophyKind';

import useSound from 'use-sound';
import useTrophyReward, { Trophy } from './trophyRewardProvider';
import { UserContext } from '../../entry';

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

export function Trophy(props: Props): JSX.Element {
    const { children, appearAtId, disappearAtId } = props;

    const { actions: { rewardTrophy, registerHandler, removeHandler } } = useTrophyReward();
    const { name, sessionId } = useContext(UserContext);

    const [display, setDisplay] = useState(false);
    const [showLights, setShowLights] = useState(false);
    const [showReward, setShowReward] = useState(false);

    const [lightAngle, setLightAngle] = useState<number>(45);

    const [appearAt, setAppearAt] = useState<RewardLocation>(CenteredLocation);
    const [disappearAt, setDisappearAt] = useState<RewardLocation>(CenteredLocation);

    const [trophyKind, setTrophyKind] = useState<TrophyKind>(TrophyKinds.default)

    const [play] = useSound(trophyKind.audio);

    const containerRef = useRef<HTMLDivElement>(null);

    const locationOfElement = function (elementId?: string): { x: number | string, y: number | string } {
        if (!elementId) return CenteredLocation;

        const element = document.getElementById(elementId)
        if (!element) return CenteredLocation;

        const rect = element.getBoundingClientRect();

        return {
            x: rect.x + (rect.right - rect.left) / 2,
            y: rect.y + (rect.bottom - rect.top) / 2,
        }
    }

    useEffect(() => {
        const keyDownHandler = (evt: KeyboardEvent) => {
            if (evt.code === 'KeyT' && rewardTrophy && name) {
                const trophy: Trophy = {
                    from: sessionId,
                    user: sessionId,
                    kind: getRandomKind(),
                }

                displayTrophy(trophy)

                rewardTrophy(trophy.user, trophy.kind);
            }
        };

        document.addEventListener('keydown', keyDownHandler);

        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        }
    }, [name, rewardTrophy, sessionId]);

    const displayTrophy = useCallback((trophy: Trophy) => {
        setAppearAt(locationOfElement(`participant:${trophy.from}`));
        setDisappearAt(locationOfElement(`participant:${trophy.user}`));

        if (TrophyKinds[trophy.kind]) {
            setTrophyKind(TrophyKinds[trophy.kind]);
        }

        setDisplay(true);

    }, [setAppearAt, setDisappearAt, setDisplay])

    useEffect(() => {
        const handleTrophy = (trophy: Trophy) => {
            if (trophy.from !== sessionId) {
                displayTrophy(trophy);
            }
        }

        if (registerHandler && removeHandler) {
            registerHandler(handleTrophy);

            return () => {
                removeHandler(handleTrophy);
            }
        }
    }, [registerHandler, removeHandler, sessionId])

    useEffect(() => {
        if (!containerRef.current || !display) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const angleDegrees = Math.atan2(height, width) * 180 / Math.PI;

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
                        kind={trophyKind}
                    />
                    {children}
                </div>
            )}
        </Transition>
    )
}