import React, { useEffect, useCallback } from "react";
import ResizeObserver from "resize-observer-polyfill";

export default function useVideoLayoutUpdate(parent: Element | undefined | null) {
    const updateLayout = useCallback(() => {
        const cordova = (window as any).cordova;
        if (!cordova || !cordova.plugins || !cordova.plugins.iosrtc) return;

        cordova.plugins.iosrtc.refreshVideos();
    }, []);

    useEffect(() => {
        if (!parent) return;

        const ro = new ResizeObserver((_entries: ResizeObserverEntry[], _observer: ResizeObserver) => {
            console.log('update video layout');
            updateLayout();
        });

        const observeElement = parent.parentElement as HTMLElement;

        ro.observe(observeElement);

        return () => {
            ro.disconnect();
        }
    }, [parent, updateLayout]);

    return { updateLayout };
}