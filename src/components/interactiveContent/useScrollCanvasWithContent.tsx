import {
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

/**
 * React hook to scroll the canvas along with the content
 * @param iframeRef {HTMLIFrameElement} The iframe which holds the content
 * @param isPdfContent {boolean} boolean to indicate if the content type is pdf
 * @param isImageContent {boolean} boolean to indicate if the content type is pdf
 * @param iframeLoaded {number} number to indicate if the iframe was loaded. 0 is the initial value.
 */
function useScrollCanvasWithContent (iframeRef: RefObject<HTMLIFrameElement>,
    isPdfContent: boolean,
    isImageContent: boolean,
    iframeLoaded: number,
    panCanvas: Function) {
    // This value is not consumed atm but can be used later on if needed.
    const [ lastScrollVal, setLastScrollVal ] = useState<number>(0.0);
    const [ elementFound, setElementFound ] = useState<boolean>(false);
    const scrollElementRef = useRef<HTMLElement>();
    const numberOfTries = 10;

    // hook onto events on the element
    useEffect(() => {
        const iframeElement = iframeRef.current;
        const contentDoc = iframeElement?.contentDocument;
        if (!contentDoc) return;

        let trial = 0;
        let element: HTMLElement;

        /**
         * Use the setInterval timer here as the pdf document uses
         * a library to enable drag on scroll which is not ready even after
         * the iframe is loaded.
         */
        const timer = setInterval(() => {
            if(trial === numberOfTries){
                clearInterval(timer);
                setElementFound(false);
                return;
            }
            element = findScrollElement(contentDoc, isPdfContent, isImageContent);
            if(element){
                clearInterval(timer);
                scrollElementRef.current = element;
                setElementFound(true);
            } else {
                trial += 1;
            }
        }, 1000);

        return () => {
            if (contentDoc && element) {
                element.onscroll = null;
                setElementFound(false);
            }
        };
    }, [
        isPdfContent,
        isImageContent,
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

    const addScrollListener = useCallback((element: HTMLElement)=>{
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
            }, 50);
        };
    }, [ scrollCanvas ]);

    // As soon as the element is found, we attach the scroll listener.
    useEffect(()=>{
        if(elementFound && scrollElementRef.current){
            addScrollListener(scrollElementRef.current);
        }
    }, [
        elementFound,
        isPdfContent,
        isImageContent,
        iframeRef,
        iframeLoaded,
        addScrollListener,
    ]);

    return {
        lastScrollVal,
        scrollCanvas,
    };
}

/**
 * Fetches the element which scrolls for h5p content.
 * Checks the scrollHeight and the clientHeight to figure out
 * which element to use. Only check the body and the firstChild of
 * the body. We could expand this in the future if required.
 * @param contentDoc {Document} The html document from which to select
 * @returns the element selected
 */
function getH5pScrollElement (contentDoc: Document){
    if(contentDoc.body.scrollHeight > contentDoc.body.clientHeight){
        return contentDoc.body;
    } else {
        return contentDoc.body.firstChild;
    }
}

/**
 *
 * @param contentDoc {Document} The html document from which to select
 * @param isPdfContent {boolean} boolean indicating if the content is boolean
 * @param isImageContent {boolean} boolean indicating if the content is an image
 * @returns {HTMLElement} the html element it selects
 */
function findScrollElement (contentDoc: Document, isPdfContent: boolean, isImageContent: boolean){
    /*
        Updated mappings 12-07-2022 (dd-mm-yyyy)
        For pdf we have to tap into the class 'indiana-scroll-container',
        This is a div added by a plugin, to add the scroll on drag feature.

        For h5p we will tap into the firstChild or the body as it changes if you visit
        pdf and then visit h5p.

        TODO: For Image content although the correct element is being selected,
        it is not working.
    */
    if(isPdfContent){
        return contentDoc.getElementsByClassName(`pdf-scroll-element`)[0] as HTMLElement;
    } else if(isImageContent){
        return contentDoc.documentElement;
    } else {
        return getH5pScrollElement(contentDoc) as HTMLElement;
    }
}

export default useScrollCanvasWithContent;
