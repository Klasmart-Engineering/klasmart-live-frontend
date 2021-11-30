import { useEffect } from "react";

export const isFocused = () => [
    undefined,
    `visible`,
    `prerender`,
].includes(document.visibilityState);

export const useWindowOnFocusChange = <T>(onFocusChange: () => T) => {
    useEffect(() => {
        window.addEventListener(`visibilitychange`, onFocusChange, false);
        window.addEventListener(`focus`, onFocusChange, false);
        return () => {
            window.removeEventListener(`visibilitychange`, onFocusChange);
            window.removeEventListener(`focus`, onFocusChange);
        };
    }, [ onFocusChange ]);
};
