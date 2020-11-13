import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { popHistory } from "../store/reducers/location";
import { State } from "../store/store";

// TODO: This useGoBack hook is not used at the moment, because the
// react router history object is used for navigation instead. In 
// the future with more complicated navigation this hook might build
// on top of the react history object instead.

export function useGoBack() {
    const history = useSelector((state: State) => state.location.history);
    const canGoBack = useMemo<boolean>(() => { return history.length > 1 }, [history]);

    const dispatch = useDispatch();

    const goBack = useCallback(() => {
        if (!canGoBack) return;

        // NOTE: current page = history[history.length - 1];
        location.href = history[history.length - 2];

        dispatch(popHistory({}));
    }, [history, canGoBack]);

    return { canGoBack, goBack };
}