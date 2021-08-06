import React, { useEffect } from "react";

export function ExternalNavigationPrompt(): JSX.Element {
    useEffect(() => {

        const onBeforeUnload = (e: Event) => {
            console.log(window.navigator);
            console.log(e);
        };

        window.addEventListener(`beforeunload`, onBeforeUnload);

        return () => {
            window.removeEventListener(`beforeunload`, onBeforeUnload);
        }
    }, []);

    return <></>
}