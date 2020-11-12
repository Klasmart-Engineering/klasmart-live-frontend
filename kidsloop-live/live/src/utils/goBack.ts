import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { popHistory } from "../store/reducers/location";
import { State } from "../store/store";

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