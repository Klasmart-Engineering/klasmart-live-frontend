import {
    RefObject,
    useCallback,
    useEffect,
    useState,
} from "react";

/**
 * React hook to scroll the canvas along with the content
 * @param iframeRef {HTMLIFrameElement} The iframe which holds the content
 * @param isPdfContent {boolean} boolean to indicate if the content type is pdf
 * @param iframeLoaded {number} number to indicate if the iframe was loaded. 0 is the initial value.
 */
function useScrollCanvasWithContent (iframeRef: RefObject<HTMLIFrameElement>,
    isPdfContent: boolean,
    iframeLoaded: number,
    panCanvas: Function) {
    // This value is not consumed atm but can be used later on if needed.
    const [ lastScrollVal, setLastScrollVal ] = useState<number>(0.0);

    // hook onto events on the element
    useEffect(() => {
        const iframeElement = iframeRef.current;
        const contentDoc = iframeElement?.contentDocument;
        if (!contentDoc) {
            return;
        }

        // For pdf content we use html element and for the rest we use body
        const element = (isPdfContent) ? contentDoc.documentElement : contentDoc.body;
        if (!element) return;
        let prevScroll = 0;
        let timeout: NodeJS.Timeout;
        element.onscroll = function () {
            if (timeout) {
                clearTimeout(timeout);
            }
            // Create a new timeout for this scroll event
            timeout = setTimeout(() => {
                scrollCanvas(element, prevScroll);
                prevScroll = element?.scrollTop;
                setLastScrollVal(prevScroll);
            }, 20);
        };

        return () => {
            if (contentDoc && element) {
                element.onscroll = null;
            }
        };
    }, [
        isPdfContent,
        iframeRef,
        iframeLoaded,
    ]);

    /**
   * Callback for scrolling the canvas.
   * @param element {HTMLElement} the html which was scrolled
   * @param prevScroll {number} the previous scroll value
   */
    const scrollCanvas = useCallback((element: HTMLElement, prevScroll: number) => {
        // Calculate the amount to scroll by
        let scroll = Math.abs(element?.scrollTop - prevScroll);
        if (prevScroll === 0) {
            scroll = element?.scrollTop;
        }
        // 1.2 is a number found by trial and error. If a better method exists, we should change it.
        const scrollY = scroll / 1.2;
        if (element?.scrollTop > prevScroll) {
            panCanvas({
                x: 0,
                y: -scrollY,
            });
        } else if (element?.scrollTop < prevScroll) {
            panCanvas({
                x: 0,
                y: scrollY,
            });
        }
    }, [ isPdfContent ]);
    return {
        lastScrollVal,
        scrollCanvas,
    };
}

export default useScrollCanvasWithContent;
