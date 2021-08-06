import { ClassType } from "../../../../store/actions";
import { redirectToLogin } from "../../../../utils/authentication";
import { useWindowSize } from "../../../../utils/viewport";
import {
    LIVE_LINK,
    LocalSessionContext,
} from "../../../providers/providers";
import { RoomContext } from "../../../providers/roomContext";
import {
    isLessonPlanOpenState,
    streamIdState,
} from "../../../states/layoutAtoms";
import {
    gql,
    useMutation,
} from "@apollo/client";
import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Refresh as RefreshIcon } from "@styled-icons/material/Refresh";
import React,
{
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

const SET_STREAMID = gql`
    mutation setSessionStreamId($roomId: ID!, $streamId: ID!) {
        setSessionStreamId(roomId: $roomId, streamId: $streamId)
    }
`;

export interface Props {
    contentId: string;
}

enum LoadStatus {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Error,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Loading,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Finished,
}

export function RecordedIframe (props: Props): JSX.Element {
    const MAX_LOADING_COUNT = 60;
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    const { roomId, classtype } = useContext(LocalSessionContext);
    const { sessions } = useContext(RoomContext);
    const [ streamId, setStreamId ] = useRecoilState(streamIdState);
    const [ isLessonPlanOpen, setIsLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);

    const { contentId } = props;
    const [ sendStreamId ] = useMutation(SET_STREAMID, {
        context: {
            target: LIVE_LINK,
        },
    });

    const [ transformScale, setTransformScale ] = useState<number>(1);
    const [ openDialog, setOpenDialog ] = useState(true);
    const [ seconds, setSeconds ] = useState(MAX_LOADING_COUNT);
    const [ loadStatus, setLoadStatus ] = useState(LoadStatus.Loading);
    const [ intervalId, setIntervalId ] = useState<number>();
    const [ contentWidth, setContentWidth ] = useState(1600);
    const [ contentHeight, setContentHeight ] = useState(1400);
    const [ userCount, setUserCount ] = useState(sessions.size);

    const [ enableResize, setEnableResize ] = useState(true);
    const [ stylesLoaded, setStylesLoaded ] = useState(false);

    const size = useWindowSize();

    useEffect(() => {
        if (sessions.size > userCount && iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type:`USER_JOIN`,
            }, `*`);
        }
        setUserCount(sessions.size);
    }, [ sessions ]);

    useEffect(() => {
        scale(contentWidth, contentHeight);
        if(classtype == ClassType.LIVE){
            setTimeout(function (){
                scaleWhiteboard();
            }, 300);
        }
    }, [ size ]);

    useEffect(() => {
        setTimeout(function (){
            window.dispatchEvent(new Event(`resize`));
        }, 300);
    }, [ isLessonPlanOpen ]);

    useEffect(() => {
        setSeconds(MAX_LOADING_COUNT);
        setLoadStatus(LoadStatus.Loading);
    }, [ contentId ]);

    useEffect(() => {
        if (loadStatus === LoadStatus.Loading) {
            setOpenDialog(true);
            const interval = window.setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
            setIntervalId(interval);
        } else if (loadStatus === LoadStatus.Finished) {
            setTimeout(function (){
                setOpenDialog(false);
                clearInterval(intervalId);
                onLoad();
                startRecording();
            }, 500);
        } else if (seconds <= 0 || loadStatus === LoadStatus.Error) {
            clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);
    }, [ loadStatus ]);

    const scale = (innerWidth: number, innerHeight: number) => {
        let currentWidth: number = size.width, currentHeight: number = size.height;

        const iRef = window.document.getElementById(`activity-view-container`) as HTMLIFrameElement;
        if (iRef) {
            currentWidth = iRef.getBoundingClientRect().width;
            currentHeight = iRef.getBoundingClientRect().height;
        }

        const shrinkRatioX = (currentWidth / innerWidth) > 1 ? 1 : currentWidth / innerWidth;
        const shrinkRatioY = (currentHeight / innerHeight) > 1 ? 1 : currentHeight / innerHeight;
        const shrinkRatio = Math.min(shrinkRatioX, shrinkRatioY);
        setTransformScale(shrinkRatio);
    };

    // TODO : Find a better system to scale the Whiteboard to the h5p
    const scaleWhiteboard = () => {
        const recordediframe = window.document.getElementById(`recordediframe`) as HTMLIFrameElement;
        const recordediframeStyles = recordediframe.getAttribute(`style`);
        const whiteboard = window.document.getElementsByClassName(`canvas-container`)[0];
        if(recordediframeStyles){
            whiteboard.setAttribute(`style`, recordediframeStyles);
        }
    };

    const getPDFURLTransformer = () => {
        const jpegTransformer = (contentId: string) => `${contentId.replace(`/assets/`, `/pdf/`)}/view.html`;
        const svgTransformer = (contentId: string) => `/pdfviewer.html?pdfSrc=${contentId}`;

        switch (process.env.PDF_VERSION) {
        case `JPEG`: return jpegTransformer;
        case `SVG`: return svgTransformer;
        default: return svgTransformer;
        }
    };

    function onLoad () {
        // TODO the client-side rendering version of H5P is ready! we can probably delete this function and the scale function above
        // if we switch over to it! Ask me (Daiki) about the details.
        const iframeElement = window.document.getElementById(`recordediframe`) as HTMLIFrameElement;
        const contentWindow = iframeElement.contentWindow;
        const contentDoc = iframeElement.contentDocument;

        if (!contentWindow || !contentDoc) { return; }

        // Custom styles when needed
        if(!stylesLoaded){
            const style = document.createElement(`style`);
            style.innerHTML = `
            img{max-width: 100%; height: auto; object-fit:contain}
            body > video{width: 100%; height: 100vh}
            .h5p-single-choice-set{
                max-height: 300px !important;
            }
            .h5p-alternative-inner{
                height: auto !important;
            }
            .h5p-column .h5p-dragquestion > .h5p-question-content > .h5p-inner{
                width: 100% !important
            }
            `;
            contentDoc.head.appendChild(style);
            // setStylesLoaded(true);
        }

        // IP Protection: Contents should not be able to be downloaded by right-clicking.
        const blockRightClick = (e: MouseEvent) => { e.preventDefault(); };
        contentWindow.addEventListener(`contextmenu`, (e) => blockRightClick(e), false);
        const h5pDivCollection = contentDoc.body.getElementsByClassName(`h5p-content`);
        const h5pTypeColumn = contentDoc.body.getElementsByClassName(`h5p-column`).length;
        const h5pTypeAccordion = contentDoc.body.getElementsByClassName(`h5p-accordion`).length;

        if (h5pDivCollection.length > 0) {
            if(h5pTypeColumn || h5pTypeAccordion){
                setEnableResize(false);
                h5pDivCollection[0].setAttribute(`style`, `width: 100% !important;`);
            }else{
                setEnableResize(true);
                h5pDivCollection[0].setAttribute(`style`, `width: auto !important;`);
            }

            const h5pContainer = h5pDivCollection[0] as HTMLDivElement;
            h5pContainer.setAttribute(`data-iframe-height`, ``);
            const h5pWidth = h5pContainer.getBoundingClientRect().width;
            const h5pHeight = h5pContainer.getBoundingClientRect().height;
            setContentWidth(h5pWidth);
            setContentHeight(h5pHeight);
            scale(h5pWidth, h5pHeight);
        } else {
            setEnableResize(true);

            if(contentDoc.body.getElementsByTagName(`img`).length){
                const imageWidth = contentDoc.body.getElementsByTagName(`img`)[0].getBoundingClientRect().width;
                const imageHeight = contentDoc.body.getElementsByTagName(`img`)[0].getBoundingClientRect().height;
                if(imageWidth && imageHeight){
                    setContentWidth(imageWidth);
                    setContentHeight(imageHeight);
                }

                if (process.env.PDF_VERSION?.toUpperCase() === `JPEG` && contentId.endsWith(`.pdf`)) {
                    // Override automatic resizing of PDF documents
                    setEnableResize(false);
                    return;
                }

            }else if(contentDoc.body.getElementsByTagName(`video`).length){
                setEnableResize(false);
            }else{
                setContentWidth(1024);
                setContentHeight(1024);
            }
        }
    }

    useEffect(() => {
        function onMessage ({ data }: MessageEvent) {
            if(!data) { return; }
            if (data.streamId) {
                if (setStreamId) { setStreamId(data.streamId); }
                sendStreamId({
                    variables: {
                        roomId,
                        streamId: data.streamId,
                    },
                });
            }
            switch(data.error){
            case `RedirectToLogin`:
                redirectToLogin();
                break;
            }
        }
        window.addEventListener(`message`, onMessage);
        return () => {
            window.removeEventListener(`message`, onMessage);
            setStreamId(``);
        };
    }, [ iframeRef.current ]);

    function startRecording () {
        try{
            const iRef = window.document.getElementById(`recordediframe`) as HTMLIFrameElement;
            if (!iRef ||
                !iRef.contentWindow ||
                (iRef.contentWindow as any).kidslooplive ||
                !iRef.contentDocument) { return; }
            const doc = iRef.contentDocument;
            const script = doc.createElement(`script`);
            script.setAttribute(`type`, `text/javascript`);
            const matches = window.location.pathname.match(/^(.*\/+)([^/]*)$/);
            const prefix = matches && matches.length >= 2 ? matches[1] : ``;
            script.setAttribute(`src`, `${prefix}record-3f6f2667.js`);
            doc.head.appendChild(script);
        }
        catch(e){
            console.log(e);
        }
    }

    return (
        <React.Fragment>
            <Dialog
                fullScreen
                hideBackdrop
                open={openDialog}
                PaperProps={{
                    style: {
                        backgroundColor: `rgba(255,255,255,0.7)`,
                    },
                }}
                style={{
                    zIndex: 1300,
                }}
            >
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    style={{
                        flexGrow: 1,
                    }}
                >
                    <Grid item>
                        <CircularProgress />
                    </Grid>
                    <Grid item>
                        <Typography
                            gutterBottom
                            variant="h6"
                            align="center">
                            {loadStatus === LoadStatus.Loading && <FormattedMessage id="loading_activity_lessonMaterial" />}
                            {loadStatus === LoadStatus.Error && <FormattedMessage id="loading_activity_error" />}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            gutterBottom
                            variant="caption"
                            align="center"
                        >
                            {loadStatus === LoadStatus.Loading && <FormattedMessage
                                id="loading_activity_lessonMaterial_description"
                                values={{
                                    seconds: seconds,
                                }} />}
                            {loadStatus === LoadStatus.Error && <FormattedMessage id="loading_activity_lessonMaterial_clickReload" />}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        style={{
                            paddingTop: theme.spacing(2),
                        }}>
                        <Button
                            disabled={loadStatus === LoadStatus.Loading}
                            onClick={() => setLoadStatus(LoadStatus.Loading)}
                        >
                            <FormattedMessage id="loading_activity_lessonMaterial_reload" />{` `}
                            <RefreshIcon
                                size="1rem"
                                style={{
                                    marginLeft: isSmDown ? 0 : 4,
                                }}
                            />
                        </Button>
                    </Grid>
                </Grid>
            </Dialog>

            <iframe
                ref={iframeRef}
                id="recordediframe"
                src={contentId.endsWith(`.pdf`)
                    ? getPDFURLTransformer()(contentId)
                    : contentId}
                style={{
                    width: enableResize ? contentWidth : `100%`,
                    height: enableResize ? contentHeight : `100%`,
                    position: enableResize ? `absolute` : `static`,
                    transformOrigin: `top left`,
                    top: classtype === ClassType.LIVE ? 0 : `auto`,
                    left: classtype === ClassType.LIVE ? 0 : `auto`,
                    transform: enableResize ? `scale(${transformScale})` : `scale(1)`,
                    minWidth: `100%`,
                }}
                onLoad={() =>  {setLoadStatus(LoadStatus.Finished); window.dispatchEvent(new Event(`resize`));}}
            />
        </React.Fragment>
    );
}
