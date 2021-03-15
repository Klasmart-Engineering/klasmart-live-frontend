import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { State } from "../store/store";

export function isElementInViewport(ref: React.RefObject<HTMLElement>): boolean {
    const drawerTabIndex = useSelector((store: State) => store.control.drawerTabIndex);

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

    return drawerTabIndex !== 0 ? true : isIntersecting;
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