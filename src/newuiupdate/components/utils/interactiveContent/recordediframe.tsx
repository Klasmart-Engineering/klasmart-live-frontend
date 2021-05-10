import CurlySpinner1 from "../../../../assets/img/spinner/curly1_spinner.gif";
import CurlySpinner2 from "../../../../assets/img/spinner/curly2_spinner.gif";
import EccoSpinner1 from "../../../../assets/img/spinner/ecco1_spinner.gif";
import EccoSpinner2 from "../../../../assets/img/spinner/ecco2_spinner.gif";
import GhostSpinner from "../../../../assets/img/spinner/ghost_spinner.gif";
import JessSpinner1 from "../../../../assets/img/spinner/jess1_spinner.gif";
import MimiSpinner1 from "../../../../assets/img/spinner/mimi1_spinner.gif";
import { useWindowSize } from "../../../../utils/viewport";
import { LIVE_LINK, LocalSessionContext } from "../../../providers/providers";
import { streamIdState } from "../../../states/layoutAtoms";
import { gql, useMutation } from "@apollo/client";
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Refresh as RefreshIcon } from "@styled-icons/material/Refresh";
import React, {
    useContext, useEffect, useRef, useState,
} from "react";
import { useSelector } from "react-redux";
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
    Error,
    Loading,
    Finished,
}

export function RecordedIframe (props: Props): JSX.Element {
    const SPINNER = [
        CurlySpinner1,
        CurlySpinner2,
        EccoSpinner1,
        EccoSpinner2,
        JessSpinner1,
        MimiSpinner1,
    ];
    const MAX_LOADING_COUNT = 60;
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    const { roomId } = useContext(LocalSessionContext);
    const [ streamId, setStreamId ] = useRecoilState(streamIdState);

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

    const [ enableResize, setEnableResize ] = useState(true);
    const [ stylesLoaded, setStylesLoaded ] = useState(false);

    const size = useWindowSize();

    useEffect(() => {
        scale(contentWidth, contentHeight);
    }, [ size ]);

    useEffect(() => {
        setSeconds(MAX_LOADING_COUNT);
        setLoadStatus(LoadStatus.Loading);

        const iRef = window.document.getElementById(`recordediframe`) as HTMLIFrameElement;
        iRef.addEventListener(`load`, () => setLoadStatus(LoadStatus.Finished));
        return () => iRef.removeEventListener(`load`, () => setLoadStatus(LoadStatus.Finished));
    }, [ contentId ]);

    useEffect(() => {
        if (loadStatus === LoadStatus.Loading) {
            const interval = window.setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
            setIntervalId(interval);
        } else if (loadStatus === LoadStatus.Finished) {
            setOpenDialog(false);
            clearInterval(intervalId);
            onLoad();
            startRecording();
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
            .h5p-content{
                display: inline-block !important;
                width: auto !important;
            }
            .h5p-course-presentation .h5p-wrapper{
                min-width: 1300px !important;
                min-height: 800px !important
            }
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

        if (h5pDivCollection.length > 0) {

            if(h5pTypeColumn){
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
        }
    }

    useEffect(() => {
        function onMessage ({ data }: MessageEvent) {
            if (data && data.streamId) {
                if (setStreamId) { setStreamId(data.streamId); }
                sendStreamId({
                    variables: {
                        roomId,
                        streamId: data.streamId,
                    },
                });
            }
        }
        window.addEventListener(`message`, onMessage);
        return () => window.removeEventListener(`message`, onMessage);
    }, [ iframeRef.current ]);

    function startRecording () {
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
        script.setAttribute(`src`, `${prefix}record-e44f2b3.js`);
        doc.head.appendChild(script);
    }

    const getRandomSpinner = (): string => SPINNER[Math.floor(Math.random() * SPINNER.length)];

    const getSpinner = (): string => loadStatus === LoadStatus.Loading ? getRandomSpinner() : GhostSpinner;

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
                        <img
                            src={getSpinner()}
                            height={80} />
                    </Grid>
                    <Grid item>
                        <Typography
                            gutterBottom
                            variant="h6"
                            align="center">
                            {loadStatus === LoadStatus.Loading
                                ? `Loading the lesson material!`
                                : null}
                            {loadStatus === LoadStatus.Error
                                ? `Sorry, something went wrong!`
                                : null}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            gutterBottom
                            variant="caption"
                            align="center"
                        >
                            {loadStatus === LoadStatus.Loading
                                ? `If you still see this screen after ${seconds} seconds, click Reload below.`
                                : null}
                            {loadStatus === LoadStatus.Error
                                ? `Please click the Reload button.`
                                : null}
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
                            Reload{` `}
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
                src={contentId}
                style={{
                    width: enableResize ? contentWidth : `100%`,
                    height: enableResize ? contentHeight : `100%`,
                    position: enableResize ? `absolute` : `static`,
                    // transformOrigin: `top left`,
                    transform: enableResize ? `scale(${transformScale})` : `scale(1)`,
                    minWidth: `100%`,
                    minHeight: `100%`,
                }}
            />
        </React.Fragment>
    );
}
