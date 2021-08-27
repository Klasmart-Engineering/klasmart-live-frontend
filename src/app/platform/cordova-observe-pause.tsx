import {
    useCallback,
    useEffect,
    useState,
} from "react";

export const useCordovaObservePause = (onPauseStateChange?: (paused: boolean) => void) => {
    const [ paused, setPaused ] = useState<boolean>(false);

    const onPauseChanged = useCallback((state: boolean) => {
        setPaused(state);

        if (onPauseStateChange) {
            onPauseStateChange(state);
        }
    }, [ setPaused, onPauseStateChange ]);

    useEffect(() => {
        const onPause = () => {
            onPauseChanged(true);
        };

        const onResume = () => {
            onPauseChanged(false);
        };

        document.addEventListener(`pause`, onPause, false);
        document.addEventListener(`resume`, onResume, false);

        return () => {
            document.removeEventListener(`pause`, onPause);
            document.removeEventListener(`resume`, onResume);
        };
    }, [ onPauseChanged ]);

    return [ paused ];
};

export default useCordovaObservePause;
