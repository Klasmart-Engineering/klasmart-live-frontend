import { useServices } from "@/app/context-provider/services-provider";
import { useCustomFlashCard } from "@/app/utils/customFlashCard";
import { injectIframeScript } from "@/app/utils/injectIframeScript";
import {
    CANVAS_RESOLUTION_MAX,
    THEME_COLOR_PRIMARY_DEFAULT,
} from "@/config";
import { useSetStreamIdMutation } from "@/data/live/mutations/useSetStreamIdMutation";
import { useSessions } from "@/data/live/state/useSessions";
import {
    useHttpEndpoint,
    useRegionSelect,
} from "@/providers/region-select-context";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    classActiveUserIdState,
    streamIdState,
} from "@/store/layoutAtoms";
import { BaseWhiteboard } from "@/whiteboard/components/BaseWhiteboard";
import WhiteboardBorder from "@/whiteboard/components/Border";
import {
    Button,
    CircularProgress,
    createStyles,
    Dialog,
    Grid,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Refresh as RefreshIcon } from "@styled-icons/material/Refresh";
import React,
{
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { useResizeDetector } from "react-resize-detector";
import {
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

const useStyles = makeStyles((theme) => createStyles({
    activityContainer: {
        width: `100%`,
        height: `100%`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    activity: {
        width: `100%`,
        height: `100%`,
        position: `absolute`,
        background: theme.palette.common.white,
    },
}));

export interface Props {
    contentHref: string;
    group?: string;
    filterGroups?: string[];
}

export enum LoadStatus {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Error,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Loading,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Finished,
}

export default function InteractionRecorder (props: Props): JSX.Element {
    const {
        contentHref,
        group,
        filterGroups,
    } = props;
    const MAX_LOADING_COUNT = 60;
    const classes = useStyles();
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    const {
        roomId,
        classType,
        token,
    } = useSessionContext();
    const sessions = useSessions();
    const setStreamId = useSetRecoilState(streamIdState);
    const classActiveUserId = useRecoilValue(classActiveUserIdState);

    const imageExtensionPattern = /\.(jpe?g|png|gif|bmp)$/gi;
    const isImageContent = contentHref?.match(imageExtensionPattern);
    const isPdfContent = contentHref.endsWith(`.pdf`);

    const [ sendStreamId ] = useSetStreamIdMutation();

    const [ openDialog, setOpenDialog ] = useState(true);
    const [ seconds, setSeconds ] = useState(MAX_LOADING_COUNT);
    const [ loadStatus, setLoadStatus ] = useState(LoadStatus.Loading);
    const [ userCount, setUserCount ] = useState(sessions.size);
    const [ initialActivityArea, setInitialActivityArea ] = useState({
        width: 0,
        height: 0,
    });

    const interval = useRef<ReturnType<typeof setInterval>>();

    const { authenticationService } = useServices();
    const { region } = useRegionSelect();

    const recorderEndpoint = useHttpEndpoint(`live`);
    const authEndpoint = useHttpEndpoint(`auth`);

    const urlParameterClassActiveUser = classActiveUserId ? `&userId=${classActiveUserId}` : ``;

    const {
        width: activityWidth = 0,
        height: activityHeight = 0,
        ref: activityAreaRef,
    } = useResizeDetector();

    useEffect(() => {
        if (!activityWidth || !activityHeight || initialActivityArea.width || initialActivityArea.height) return;
        setInitialActivityArea({
            width: activityWidth,
            height: activityHeight,
        });
    }, [
        activityWidth,
        activityHeight,
        initialActivityArea.height,
        initialActivityArea.width,
    ]);

    const activityAreaScale = useMemo(() => {
        if (!activityWidth || !activityHeight || !initialActivityArea.width || !initialActivityArea.height) return 1;
        return Math.min(activityWidth / initialActivityArea.width, activityHeight / initialActivityArea.height);
    }, [
        activityWidth,
        activityHeight,
        initialActivityArea.height,
        initialActivityArea.width,
    ]);

    const getPDFURLTransformer = (contentHref: string, token: string | undefined, recorderEndpoint: string, encodedEndpoint: string, encodedAuthEndpoint: string) => {
        const pdfEndpoint = !process.env.IS_CORDOVA_BUILD ? `${process.env.ENDPOINT_PDF}/pdf` : region?.services.pdf ?? ``;
        const pdfPath = contentHref.replace(`${recorderEndpoint}`, ``);
        const jpegTransformer = `pdfviewer.html?pdf=${pdfPath}&token=${token}&endpoint=${encodedEndpoint}&auth=${encodedAuthEndpoint}&pdfendpoint=${pdfEndpoint}`;
        const svgTransformer = `${contentHref.replace(`${recorderEndpoint}/assets`, `pdfviewer.html?pdfSrc=/assets`)}&token=${token}&endpoint=${encodedEndpoint}&auth=${encodedAuthEndpoint}&pdfendpoint=${pdfEndpoint}`;
        switch (process.env.PDF_VERSION) {
        case `JPEG`: return jpegTransformer;
        case `SVG`: return svgTransformer;
        default: return svgTransformer;
        }
    };

    const contentHrefWithToken = useMemo<string>(() => {
        const encodedEndpoint = encodeURIComponent(recorderEndpoint);
        const encodedAuthEndpoint = encodeURIComponent(authEndpoint);
        if (contentHref.endsWith(`.pdf`)) {
            return getPDFURLTransformer(contentHref, token, recorderEndpoint, encodedEndpoint, encodedAuthEndpoint);
        }
        return `${contentHref}?token=${token}&endpoint=${encodedEndpoint}&auth=${encodedAuthEndpoint}${urlParameterClassActiveUser}`;

    }, [
        contentHref,
        token,
        recorderEndpoint,
        authEndpoint,
    ]);

    useCustomFlashCard({
        iframeID: `recordediframe`,
        loadStatus: loadStatus,
        openLoadingDialog: openDialog,
        setOpenLoadingDialog: setOpenDialog,
    });

    useEffect(() => {
        if (sessions.size > userCount && iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: `USER_JOIN`,
            }, `*`);
        }
        setUserCount(sessions.size);
    }, [ sessions ]);

    const sendIframeClassActiveUser = (userId?: string) => {
        if (classType !== ClassType.CLASSES && !userId) return;

        iframeRef?.current?.contentWindow?.postMessage({
            type: `CLASS_ACTIVE_USER`,
            user: userId,
        }, `*`);
    };

    useEffect(() => {
        sendIframeClassActiveUser(classActiveUserId);
    }, [ classActiveUserId ]);

    useEffect(() => {
        setLoadStatus(LoadStatus.Loading);
        setSeconds(MAX_LOADING_COUNT);
        setOpenDialog(true);
        interval.current = setInterval(() => {
            setSeconds(seconds => seconds - 1);
        }, 1000);

        return () => clearInterval(interval.current as ReturnType<typeof setInterval>);
    }, [ contentHrefWithToken ]);

    function onLoad () {
        const iframeElement = iframeRef.current;
        const contentWindow = iframeElement?.contentWindow;
        const contentDoc = iframeElement?.contentDocument;

        if (!contentWindow || !contentDoc) { return; }

        if(!contentDoc.head){
            const head = document.createElement(`head`);
            contentDoc.documentElement.prepend(head);
        }

        // Remove styles if exists
        document.getElementById(`kidsloop-live-frontend-styles`)
            ?.remove();
        document.getElementById(`kidsloop-live-frontend-image-styles`)
            ?.remove();
        document.getElementById(`kidsloop-live-frontend-scrollbar`)
            ?.remove();

        // Custom styles when needed (general)
        const style = document.createElement(`style`);
        style.setAttribute(`id`, `kidsloop-live-frontend-styles`);
        style.innerHTML = `
            img:not(.pdfImage) { max-width: 100%; height: auto; object-fit:contain }
            body > video { width: 100%; height: 100vh }
            .h5p-single-choice-set { max-height: 300px !important; }
            .h5p-alternative-inner{ height: auto !important; }
            .h5p-column .h5p-dragquestion > .h5p-question-content > .h5p-inner{ width: 100% !important }
            ::-webkit-media-controls { display: flex; justify-content: center; align-items: center; }
            ::-webkit-media-controls-enclosure {max-width: 400px }
        `;
        contentDoc.head.appendChild(style);

        if (isImageContent) {
            const imageStyle = document.createElement(`style`);
            imageStyle.setAttribute(`id`, `kidsloop-live-frontend-image-styles`);
            imageStyle.innerHTML = `img { pointer-events: none }`;
            contentDoc.head.appendChild(imageStyle);
        }

        // Scrollbar styles
        // 1. Remove Scrollbar cross-browsers for Live class activities H5P/PDF/.. RRWEB don't replay the scrollbar so content is shifted (KLL-1935)
        // 2. Stylize Scrollbar for Study and Class
        const scrollbarStyle = document.createElement(`style`);
        scrollbarStyle.setAttribute(`id`, `kidsloop-live-frontend-scrollbar`);

        if (classType === ClassType.LIVE) {
            scrollbarStyle.innerHTML = `
                body { scrollbar-width: none; -ms-overflow-style: none; }
                body::-webkit-scrollbar { width: 0; height: 0 }

                ${isPdfContent && `
                    /* rrweb can not replay scroll event on iOS Safari, set 'overflow: scroll' to enable scroll position (scrollTop and scrollLeft)*/
                    #app-pdf { 
                        overflow: auto;
                        background: #c4c4c4;
                    }
                    #app-pdf::-webkit-scrollbar:horizontal { height: 20px; } #app-pdf::-webkit-scrollbar-track:horizontal { background: #f1f1f1; } #app-pdf::-webkit-scrollbar-thumb:horizontal { background: #888; border: 5px solid #f1f1f1;}
                    ::-webkit-scrollbar {
                        width: 0;
                        background: transparent;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: transparent;
                    }
                    `
}
            `;
        } else {
            scrollbarStyle.innerHTML = `
                body::-webkit-scrollbar { -webkit-appearance: none; width: 14px; }
                body::-webkit-scrollbar-thumb { background-color: ${THEME_COLOR_PRIMARY_DEFAULT}; border-radius: 10px; border: 3px solid #ffffff; }
            `;
        }
        contentDoc.head.appendChild(scrollbarStyle);

        // IP Protection: Contents should not be able to be downloaded by right-clicking.
        const blockRightClick = (e: MouseEvent) => { e.preventDefault(); };
        contentWindow.addEventListener(`contextmenu`, (e) => blockRightClick(e), false);

        if (!isPdfContent) {
            if (process.env.IS_CORDOVA_BUILD) {
                injectIframeScript(iframeElement, `h5presize`);
            } else {
                const iframeScript = document.createElement(`script`);
                iframeScript.setAttribute(`id`, `kidsloop-live-frontend-script-inject`);

                iframeScript.innerHTML = `
                    const triggerH5pResize = () => {
                        if (!H5P) {
                            console.error('H5P not available on this page.');
                            return;
                        }
                        console.log('[H5P] Trigger resize');
                        H5P.trigger(H5P.instances[0], 'resize');
                    }
                    window.addEventListener('iframe-browser-resize', triggerH5pResize, false);
                `;
                contentDoc.head.appendChild(iframeScript);
            }
        }
    }

    useEffect(() => {
        function onMessage ({ data }: MessageEvent) {
            if (!data) { return; }
            if (data.streamId) {
                setStreamId?.(data.streamId);
                sendStreamId({
                    variables: {
                        roomId,
                        streamId: data.streamId,
                    },
                });
            }
            switch (data.error) {
            case `RedirectToLogin`:
                authenticationService?.signout();
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
        if (process.env.IS_CORDOVA_BUILD) {
            try {
                const iRef = iframeRef.current;
                if (!iRef ||
                    !iRef.contentWindow ||
                    (iRef.contentWindow as any).kidslooplive ||
                    !iRef.contentDocument) { return; }

                injectIframeScript(iRef, `record`);
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const iRef = iframeRef.current;
                if (!iRef ||
                    !iRef.contentWindow ||
                    (iRef.contentWindow as any).kidslooplive ||
                    !iRef.contentDocument) { return; }
                const doc = iRef.contentDocument;
                const script = doc.createElement(`script`);
                script.setAttribute(`type`, `text/javascript`);
                const matches = window.location.pathname.match(/^(.*\/+)([^/]*)$/);
                const prefix = matches && matches.length >= 2 ? matches[1] : ``;
                script.setAttribute(`src`, `${prefix}record.${process.env.GIT_COMMIT}.js`);
                doc.head.appendChild(script);
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    function onLoadIframe() {
        sendIframeClassActiveUser(classActiveUserId);
        onLoad();
        if (classType !== ClassType.STUDY) {
            startRecording();
        }
        setLoadStatus(LoadStatus.Finished);
        clearInterval(interval.current as ReturnType<typeof setInterval>);
        setOpenDialog(false);
    }

    useEffect(() => {
        const iframeElement = iframeRef.current;
        const contentDocument = iframeElement?.contentDocument;
        const contentWindowDocument = iframeElement?.contentWindow?.document;

        const documentRef = contentDocument || contentWindowDocument;
        if(!documentRef) return;

        const timer = setInterval(function () {
            if (documentRef.readyState === `complete`) {
                clearInterval(timer);
                console.log(`iframe ready`);
                onLoadIframe();
            }
        }, 1000);

    }, [ contentHrefWithToken, iframeRef.current ]);
    return (
        <>
            <div
                ref={activityAreaRef}
                className={classes.activityContainer}
            >
                <div
                    style={{
                        transform: `scale(${activityAreaScale})`,
                        width: initialActivityArea.width,
                        height: initialActivityArea.height,
                        transformOrigin: `center`,
                        position: `absolute`,
                    }}
                >
                    <iframe
                        key={contentHref}
                        ref={iframeRef}
                        id="recordediframe"
                        src={contentHrefWithToken}
                        allow="microphone"
                        className={classes.activity}
                        onLoad={() => { onLoadIframe(); }}
                        onError={() => {
                            setLoadStatus(LoadStatus.Error);
                            clearInterval(interval.current as ReturnType<typeof setInterval>);
                        }}
                    />
                    <BaseWhiteboard
                        group={group}
                        filterGroups={filterGroups}
                        width={initialActivityArea.width * (CANVAS_RESOLUTION_MAX / initialActivityArea.width)}
                        height={initialActivityArea.height * (CANVAS_RESOLUTION_MAX / initialActivityArea.width)}
                    />
                </div>
                <WhiteboardBorder
                    width={initialActivityArea.width * activityAreaScale}
                    height={initialActivityArea.height * activityAreaScale}
                />
            </div>
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
                    justifyContent="center"
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
                            align="center"
                        >
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
                                }}
                                                                  />}
                            {loadStatus === LoadStatus.Error && <FormattedMessage id="loading_activity_lessonMaterial_clickReload" />}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        style={{
                            paddingTop: theme.spacing(2),
                        }}
                    >
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
        </>
    );
}
