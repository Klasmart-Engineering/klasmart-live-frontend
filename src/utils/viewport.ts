import { useEffect, useState } from "react"
import ResizeObserver from "resize-observer-polyfill";

export function useIsElementInViewport(ref: React.RefObject<HTMLElement>): boolean {

    const [isIntersecting, setIntersecting] = useState(false)
    const observer = new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting)
    )

    useEffect(() => {
        if (ref.current) {
            observer.observe(ref.current)
        }
        // Remove the observer as soon as the component is unmounted
        return () => {
            observer.disconnect()
        }
    }, [])

    return isIntersecting
}

export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
}

export function useElementSize(elementID: string, defaultSize: {width?: number, height?: number} | null) {
    const [elementSize, setElementSize] = useState({
        width: defaultSize && defaultSize.width? defaultSize.width : 0,
        height: defaultSize && defaultSize.height? defaultSize.height : 0
    })

    useEffect(() => {
        const element = window.document.getElementById(elementID) as HTMLElement;
        const ro = new ResizeObserver((_entries: ResizeObserverEntry[], _observer: ResizeObserver) => {
            for (let entry of _entries) {
                if(entry.contentRect) {
                    setElementSize({width: entry.contentRect.width, height: entry.contentRect.height});
                }
            }
        });
        ro.observe(element);
        return () => {
            ro.disconnect();
        }
    },[])

    return elementSize;
}