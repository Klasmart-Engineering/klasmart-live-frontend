import { v4 as uuid } from "uuid";
export const sessionId = uuid();

import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
// import * as Sentry from '@sentry/react';
import { render } from "react-dom";
import { RawIntlProvider, FormattedMessage } from "react-intl";
import { Provider, useSelector, useStore } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
    isMobileOnly,
    isTablet,
    isBrowser,
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
} from "react-device-detect";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache } from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";
import jwt_decode from "jwt-decode";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";

import { ActionTypes } from "./store/actions"
import { createDefaultStore, State } from "./store/store";
import { LessonMaterial, MaterialTypename } from "./lessonMaterialContext";
import { AuthTokenProvider } from "./services/auth-token/AuthTokenProvider";
import { themeProvider } from "./themeProvider";
import { Room, RoomContext } from "./pages/room/room";
import { Trophy } from "./components/trophies/trophy";
import { Join } from "./pages/join/join";
import BrowserList, { detectIE } from "./pages/browserList";
import { getLanguage, getDefaultLanguageCode } from "./utils/locale";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Signup } from "./pages/account/signup";
import { Signin } from "./pages/account/signin";
import { PasswordChange } from "./pages/account/password/password-change";
import { PasswordChanged } from "./pages/account/password/password-changed";
import { PasswordForgot } from "./pages/account/password/password-forgot";
import { PasswordRestore } from "./pages/account/password/password-restore";

/*
Sentry.init({
    dsn: "https://9f4fca35be3b4b7ca970a126f26a5e54@o412774.ingest.sentry.io/5388813",
    environment: process.env.NODE_ENV || "not-specified",
});
*/

const authToken = AuthTokenProvider.retrieveToken();
const wsLink = new WebSocketLink({
    uri: process.env.ENDPOINT_WEBSOCKET || `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/graphql`,
    options: {
        reconnect: true,
        connectionParams: {
            authToken,
            sessionId
        },
    }
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: wsLink
} as any);

export interface IThemeContext {
    themeMode: string,
    languageCode: string,
    setThemeMode: React.Dispatch<React.SetStateAction<string>>
    setLanguageCode: React.Dispatch<React.SetStateAction<string>>
}

export interface IUserContext {
    teacher: boolean,
    materials: LessonMaterial[]
    roomId: string,
    sessionId: string,
    name?: string,
    setName: React.Dispatch<React.SetStateAction<string | undefined>>
    camera?: MediaStream | null,
    setCamera: React.Dispatch<React.SetStateAction<MediaStream | undefined | null>>,
}

export const ThemeContext = createContext<IThemeContext>({ themeMode: "", setThemeMode: () => null, languageCode: "", setLanguageCode: () => null } as any as IThemeContext);
export const UserContext = createContext<IUserContext>({ setName: () => null, roomId: "", materials: [], teacher: false } as any as IUserContext);

const url = new URL(window.location.href)
if (url.hostname !== "localhost" && url.hostname !== "live.kidsloop.net") {
    window.addEventListener("contextmenu", (e: MouseEvent) => { e.preventDefault() }, false);
}

function parseToken() {
    try {
        const useTestToken = process.env.USE_TEST_TOKEN || false;
        if (useTestToken || url.hostname === "localhost" || url.hostname === "live.kidsloop.net" || url.hostname.includes("ngrok.io")) {
            const token = url.searchParams.get("token");
            if (token) {
                const payload = jwt_decode(token) as any;
                const parsedMaterials = payload.materials.map((mat: any) => {
                    if (mat.__typename === "Iframe") {
                        return { __typename: MaterialTypename.Iframe, name: mat.name, url: mat.url };
                    } else if (mat.__typename === "Video") {
                        return { __typename: MaterialTypename.Video, name: mat.name, url: mat.url };
                    } else if (mat.__typename === "Audio") {
                        return { __typename: MaterialTypename.Audio, name: mat.name, url: mat.url };
                    } else if (mat.__typename === "Image") {
                        return { __typename: MaterialTypename.Image, name: mat.name, url: mat.url };
                    }
                });
                return {
                    teacher: payload.teacher ? Boolean(payload.teacher) : false,
                    name: payload.name ? String(payload.name) : undefined,
                    roomId: String(payload.roomid),
                    materials: parsedMaterials || [],
                };
            } else {
                const materialsParam = url.searchParams.get("materials");

                return {
                    teacher: url.searchParams.get("teacher") !== null,
                    name: url.searchParams.get("name") || undefined, // Should be undefined not null
                    roomId: url.searchParams.get("roomId") || "app-room",
                    materials: materialsParam ? JSON.parse(materialsParam) : [
                        { __typename: MaterialTypename.Iframe, name: "Pairs", url: `/h5p/play/5ecf4e4b611e18398f7380ef` },
                        { __typename: MaterialTypename.Iframe, name: "Flashcards", url: `/h5p/play/5ed05dd1611e18398f7380f4` },
                        { __typename: MaterialTypename.Iframe, name: "Drag and Drop", url: `/h5p/play/5ed0b64a611e18398f7380fb` },
                        { __typename: MaterialTypename.Iframe, name: "Hot Spot 1", url: `/h5p/play/5ecf6f43611e18398f7380f0` },
                        { __typename: MaterialTypename.Iframe, name: "Hot Spot 2", url: `/h5p/play/5ed0a79d611e18398f7380f7` },
                        { __typename: MaterialTypename.Video, name: "Video", url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || "."}/test_video.mp4` },
                        { __typename: MaterialTypename.Audio, name: "Audio", url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || "."}/test_audio.m4a` },
                        { __typename: MaterialTypename.Image, name: "Portrait Image", url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || "."}/test_image_portrait.jpg` },
                        { __typename: MaterialTypename.Image, name: "Landscape Image", url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || "."}/test_image_landscape.jpg` },
                        { name: "Pairs - Legacy", url: `/h5p/play/5ecf4e4b611e18398f7380ef` },
                        { name: "Video - Legacy", video: `${process.env.ENDPOINT_TEST_ASSETS_S3 || "."}/test_video.mp4` },
                        { __typename: MaterialTypename.Iframe, name: "Quiz", url: "/h5p/play/5ed07656611e18398f7380f6" },
                    ],
                };
            }
        }

        const token = url.searchParams.get("token");
        if (!token) { return; }
        const payload = jwt_decode(token) as any;
        return {
            teacher: payload.teacher ? Boolean(payload.teacher) : false,
            name: payload.name ? String(payload.name) : undefined,
            roomId: String(payload.roomid),
            materials: payload.materials || [],
        };
        // eslint-disable-next-line no-empty
    } catch (e) { }
    return;
}
const params = parseToken();
function Entry() {
    const store = useStore();
    const themeMode = useSelector((state: State) => state.session.darkMode);
    const languageCode = useSelector((state: State) => state.session.locale);
    const locale = getLanguage(languageCode);

    if (!params) {
        return <RawIntlProvider value={locale}><Typography><FormattedMessage id="error_invaild_token" /></Typography></RawIntlProvider>;
    }

    const [camera, setCamera] = useState<MediaStream | null>();
    const [name, setName] = useState(params.name);

    const userContext = useMemo<IUserContext>(() => ({
        camera,
        setCamera,
        name,
        setName,
        sessionId,
        roomId: params.roomId,
        teacher: params.teacher,
        materials: params.materials
    }), [camera, setCamera, name, setName, params]);

    useEffect(() => {
        const userAgent = {
            isMobileOnly,
            isTablet,
            isBrowser,
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
        };
        console.log("userAgent: ", userAgent)
        store.dispatch({ type: ActionTypes.USER_AGENT, payload: userAgent });
    }, []);

    return (
        <UserContext.Provider value={userContext}>
            <RawIntlProvider value={locale}>
                <ThemeProvider theme={themeProvider(languageCode, themeMode)}>
                    <CssBaseline />
                    <HashRouter>
                        <Switch>
                            <Route path="/password-change" component={PasswordChange} />
                            <Route path="/password-changed" component={PasswordChanged} />
                            <Route path="/password-forgot" component={PasswordForgot} />
                            <Route path="/password-restore" component={PasswordRestore} />
                            <Route path="/room" component={Room} />
                            <Route path="/signup" component={Signup} />
                            <Route path="/signin" component={Signin} />
                            <Route path="/" component={Join} />
                        </Switch>
                    </HashRouter>
                </ThemeProvider>
            </RawIntlProvider>
        </UserContext.Provider>
    );
}

async function main() {
    const { store, persistor } = createDefaultStore();
    const isIE = detectIE();

    let renderComponent: JSX.Element;
    if (isIE <= 11 && isIE !== false) {
        renderComponent = <BrowserList />
    } else if (
        (!isMobileOnly && (isChrome || isSafari || isFirefox)) || // !isMobileOnly == Desktop
        (isIOS && isSafari) ||
        (isAndroid && isChrome)
    ) {
        renderComponent = (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ApolloProvider client={client}>
                        <Entry />
                    </ApolloProvider>
                </PersistGate>
            </Provider>
        )
    } else {
        renderComponent = <BrowserList />
    }

    render(
        renderComponent,
        document.getElementById("app")
    );
}

main();
