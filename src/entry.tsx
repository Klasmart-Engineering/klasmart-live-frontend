import ChromeLogo from "./assets/img/browser/chrome_logo.svg";
import SafariLogo from "./assets/img/browser/safari_logo.png";
import {
    LessonMaterial,
    MaterialTypename,
} from "./lessonMaterialContext";
import  NewUIEntry  from "./newuiupdate/entry";
import { setUserAgent } from "./store/reducers/session";
import { createDefaultStore } from "./store/store";
import { themeProvider } from "./themeProvider";
import {
    getDefaultLanguageCode,
    getLanguage,
} from "./utils/locale";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as Sentry from '@sentry/react';
import jwt_decode from "jwt-decode";
import React,
{
    createContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    isAndroid,
    isChrome,
    isChromium,
    isEdge,
    isFirefox,
    isIE,
    isIOS,
    isIOS13,
    isMacOs,
    isMobileOnly,
    isMobileSafari,
    isSafari,
    isSmartTV,
    isTablet,
} from "react-device-detect";
import { render } from "react-dom";
import {
    FormattedMessage,
    RawIntlProvider,
} from "react-intl";
import {
    Provider,
    useDispatch,
} from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { v4 as uuid } from "uuid";

export const sessionId = uuid();
export const SFU_LINK = `SFU_LINK`;
export const LIVE_LINK = `LIVE_LINK`;

/*
    Most of the things that used to be done in this file is now done inside the /newuiupdate/providers/providers.tsx
    So this file contains lots of dead code which needs to be removed
*/
Sentry.init({
    dsn: `https://9f4fca35be3b4b7ca970a126f26a5e54@o412774.ingest.sentry.io/5388813`,
    environment: process.env.NODE_ENV || `not-specified`,
});

export interface IThemeContext {
    themeMode: string;
    languageCode: string;
    setThemeMode: React.Dispatch<React.SetStateAction<string>>;
    setLanguageCode: React.Dispatch<React.SetStateAction<string>>;
}

export interface ILocalSessionContext {
    classtype: string; // "live" | "class" | "study" | "task"
    org_id: string;
    isTeacher: boolean;
    materials: LessonMaterial[];
    roomId: string;
    sessionId: string;
    name?: string;
    setName: React.Dispatch<React.SetStateAction<string | undefined>>;
    camera?: MediaStream;
    setCamera: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
}

export const ThemeContext = createContext<IThemeContext>({
    themeMode: ``,
    setThemeMode: () => null,
    languageCode: ``,
    setLanguageCode: () => null,
} as any as IThemeContext);
export const LocalSessionContext = createContext<ILocalSessionContext>({
    setName: () => null,
    roomId: ``,
    materials: [],
    isTeacher: false,
} as any as ILocalSessionContext);

const url = new URL(window.location.href);
if (url.hostname !== `localhost` && url.hostname !== `live.beta.kidsloop.net`) {
    window.addEventListener(`contextmenu`, (e: MouseEvent) => { e.preventDefault(); }, false);
}

function parseToken () {
    try {
        const token = url.searchParams.get(`token`);
        if (token) {
            const payload = jwt_decode(token) as any;
            const materials = payload.materials ? payload.materials : [];
            const parsedMaterials = materials.map((mat: any) => {
                if (mat.__typename === `Iframe`) {
                    return {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        __typename: MaterialTypename.Iframe,
                        name: mat.name,
                        url: mat.url,
                    };
                } else if (mat.__typename === `Video`) {
                    return {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        __typename: MaterialTypename.Video,
                        name: mat.name,
                        url: mat.url,
                    };
                } else if (mat.__typename === `Audio`) {
                    return {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        __typename: MaterialTypename.Audio,
                        name: mat.name,
                        url: mat.url,
                    };
                } else if (mat.__typename === `Image`) {
                    return {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        __typename: MaterialTypename.Image,
                        name: mat.name,
                        url: mat.url,
                    };
                }
            });
            return {
                classtype: payload.classtype ? String(payload.classtype) : `live`,
                org_id: payload.org_id ? String(payload.org_id) : ``,
                isTeacher: payload.teacher ? Boolean(payload.teacher) : false,
                name: payload.name ? String(payload.name) : undefined,
                roomId: String(payload.roomid),
                materials: parsedMaterials || [],
            };
        }
        // TODO think of a better way to set up the debug environment
        const isDebugMode = url.hostname === `localhost` || url.hostname === `0.0.0.0`;
        if (isDebugMode) {
            const materialsParam = url.searchParams.get(`materials`);
            return {
                classtype: url.searchParams.get(`classtype`) || `live`,
                org_id: url.searchParams.get(`org_id`) || ``,
                isTeacher: url.searchParams.get(`teacher`) !== null,
                name: url.searchParams.get(`name`) || undefined, // Should be undefined not null
                roomId: url.searchParams.get(`roomId`) || `test-room`,
                materials: materialsParam ? JSON.parse(materialsParam) : [
                    {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        __typename: MaterialTypename.Iframe,
                        name: `Interactive video`,
                        url: `/h5p/play/60588e7475aa32001244926f`,
                    },
                    {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        __typename: MaterialTypename.Iframe,
                        name: `Course Presentation`,
                        url: `/h5p/play/60588da62af9710014707a2d`,
                    },
                    {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        __typename: MaterialTypename.Iframe,
                        name: `Drag and drop`,
                        url: `/h5p/play/60589f9375aa32001244928a`,
                    },
                    {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        __typename: MaterialTypename.Iframe,
                        name: `Memory Game`,
                        url: `/h5p/play/605891d02af9710014707a44`,
                    },
                    {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        __typename: MaterialTypename.Iframe,
                        name: `Fruit`,
                        url: `/h5p/play/604afe4c75aa320012448fca`,
                    },
                    {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        __typename: MaterialTypename.Video,
                        name: `Video`,
                        url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || `.`}/test_video.mp4`,
                    },
                    {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        __typename: MaterialTypename.Audio,
                        name: `Audio`,
                        url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || `.`}/test_audio.m4a`,
                    },
                    {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        __typename: MaterialTypename.Image,
                        name: `Portrait Image`,
                        url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || `.`}/test_image_portrait.jpg`,
                    },
                    {
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        __typename: MaterialTypename.Image,
                        name: `Landscape Image`,
                        url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || `.`}/test_image_landscape.jpg`,
                    },
                    {
                        name: `Pairs - Legacy`,
                        url: `/h5p/play/5ecf4e4b611e18398f7380ef`,
                    },
                    {
                        name: `Video - Legacy`,
                        video: `${process.env.ENDPOINT_TEST_ASSETS_S3 || `.`}/test_video.mp4`,
                    },
                ],
            };
        }
    } catch (e) {
        console.error(e);
    }
    return;
}
const params = parseToken();
const roomId = params ? params.roomId : ``;
function Entry () {
    const [ camera, setCamera ] = useState<MediaStream>();
    const [ name, setName ] = useState(params ? params.name : ``);
    const [ languageCode, setLanguageCode ] = useState(url.searchParams.get(`lang`) || getDefaultLanguageCode());
    const [ themeMode, setThemeMode ] = useState(url.searchParams.get(`theme`) || `light`);
    const locale = getLanguage(languageCode);

    const themeContext = useMemo<IThemeContext>(() => ({
        themeMode,
        setThemeMode,
        languageCode,
        setLanguageCode,
    }), [
        themeMode,
        setThemeMode,
        languageCode,
        setLanguageCode,
    ]);

    const localSession = useMemo<ILocalSessionContext>(() => ({
        classtype: params ? params.classtype : `live`,
        org_id: params ? params.org_id : ``,
        camera,
        setCamera,
        name,
        setName,
        sessionId,
        roomId: params ? params.roomId : ``,
        isTeacher: params && params.isTeacher ? params.isTeacher : false,
        materials: params ? params.materials : null,
    }), [
        camera,
        setCamera,
        name,
        setName,
        params,
    ]);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setUserAgent({
            isMobileOnly,
            isTablet,
            isBrowser: true,
            isSmartTV,
            isAndroid,
            isIOS,
            isChrome,
            isFirefox,
            isSafari,
            isIE,
            isEdge,
            isChromium,
            isMobileSafari,
        }));
    }, []);

    return (
        <ThemeContext.Provider value={themeContext}>
            <LocalSessionContext.Provider value={localSession}>
                <RawIntlProvider value={locale}>
                    <ThemeProvider theme={themeProvider(languageCode, themeMode)}>
                        <CssBaseline />
                        {!params ? <Typography><FormattedMessage id="error_invaild_token" /></Typography> : <App />}
                    </ThemeProvider>
                </RawIntlProvider>
            </LocalSessionContext.Provider>
        </ThemeContext.Provider>
    );
}

let renderComponent: JSX.Element;
if (
    isMacOs && (isSafari || isChrome) // Support Safari and Chrome in MacOS
    || (isIOS || isIOS13) && isSafari // Support only Safari in iOS
    || (!isIOS || !isIOS13) && isChrome // Support only Chrome in other OS
) {
    const { store, persistor } = createDefaultStore();
    renderComponent = (
        <Provider store={store}>
            <PersistGate
                loading={null}
                persistor={persistor}>
                <NewUIEntry />
            </PersistGate>
        </Provider>
    );
} else {
    renderComponent = <BrowserGuide />;
}
render(renderComponent, document.getElementById(`app`));

function BrowserGuide () {
    return (
        <Grid
            container
            justify="center"
            alignItems="center"
            style={{
                display: `flex`,
                flexGrow: 1,
                height: `100vh`,
            }}
        >
            <GuideContent />
        </Grid>
    );
}

function GuideContent () {
    // const browserName = iOS ? "Safari" : "Chrome";
    const apple = isMacOs || isIOS || isIOS13;
    const [ languageCode, _ ] = useState(url.searchParams.get(`lang`) || getDefaultLanguageCode());
    const locale = getLanguage(languageCode);
    return (
        <RawIntlProvider value={locale}>
            <Grid
                container
                direction="column"
                alignItems="center"
                alignContent="center"
                spacing={1}
            >
                <Grid item>
                    <img
                        src={apple ? SafariLogo : ChromeLogo}
                        height={80} />
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1">
                        {apple ? (isMacOs ?
                            <FormattedMessage id="browser_guide_title_macos" /> :
                            <FormattedMessage id="browser_guide_title_ios" />
                        ) : <FormattedMessage id="browser_guide_title" />}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle2">
                        <FormattedMessage id="browser_guide_body" />
                    </Typography>
                </Grid>
            </Grid>
        </RawIntlProvider>
    );
}
