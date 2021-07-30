import {
    LessonMaterial,
    MaterialTypename,
} from "../../lessonMaterialContext";
import {
    getDefaultLanguageCode,
    getLanguage,
} from "../../utils/locale";
import { themeProvider } from "../themeProvider";
import { ThemeProvider } from "@material-ui/core";
import jwt_decode from "jwt-decode";
import React,
{
    createContext,
    ReactChild,
    ReactChildren,
    useMemo,
    useState,
} from 'react';
import { RawIntlProvider } from "react-intl";
import { v4 as uuid } from "uuid";

export const sessionId = uuid();
export const LIVE_LINK = `LIVE_LINK`;
export const SFU_LINK = `SFU_LINK`;

type Props = {
    children?: ReactChild | ReactChildren | null;
}

const url = new URL(window.location.href);
if (url.hostname !== `localhost` && url.hostname !== `live.beta.kidsloop.net`) {
    window.addEventListener(`contextmenu`, (e: MouseEvent) => { e.preventDefault(); }, false);
}

const params = parseToken();
/*
if (params && params.name) {
    LogRocket.identify(params.name, {
        sessionId,
    });
}
*/

function Providers ({ children }: Props) {
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
        schedule_id: params ? params.schedule_id : ``,
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

    return (
        <ThemeContext.Provider value={themeContext}>
            <LocalSessionContext.Provider value={localSession}>
                <RawIntlProvider value={locale}>
                    <ThemeProvider theme={themeProvider(`en`, `light`)}>
                        {children}
                    </ThemeProvider>
                </RawIntlProvider>
            </LocalSessionContext.Provider>
        </ThemeContext.Provider>
    );
}

export default Providers;

export interface IThemeContext {
    themeMode: string;
    languageCode: string;
    setThemeMode: React.Dispatch<React.SetStateAction<string>>;
    setLanguageCode: React.Dispatch<React.SetStateAction<string>>;
}
export interface ILocalSessionContext {
    classtype: string; // "live" | "class" | "study" | "task"
    org_id: string;
    schedule_id: string;
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

function parseToken () {
    try {
        const token = url.searchParams.get(`token`);
        if (token) {
            const payload = jwt_decode(token) as any;
            const materials = payload.materials ? payload.materials : [];
            const parsedMaterials = materials.map((mat: any) => {
                if (mat.__typename === `Iframe`) {
                    return {
                        __typename: MaterialTypename.Iframe,
                        name: mat.name,
                        url: mat.url,
                    };
                } else if (mat.__typename === `Video`) {
                    return {
                        __typename: MaterialTypename.Video,
                        name: mat.name,
                        url: mat.url,
                    };
                } else if (mat.__typename === `Audio`) {
                    return {
                        __typename: MaterialTypename.Audio,
                        name: mat.name,
                        url: mat.url,
                    };
                } else if (mat.__typename === `Image`) {
                    return {
                        __typename: MaterialTypename.Image,
                        name: mat.name,
                        url: mat.url,
                    };
                }
            });
            return {
                classtype: payload.classtype ? String(payload.classtype) : `live`,
                org_id: payload.org_id ? String(payload.org_id) : ``,
                schedule_id: payload.schedule_id ? String(payload.schedule_id) : ``,
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
                schedule_id: url.searchParams.get(`schedule_id`) || ``,
                isTeacher: url.searchParams.get(`teacher`) !== null,
                name: url.searchParams.get(`name`) || undefined, // Should be undefined not null
                roomId: url.searchParams.get(`roomId`) || `test-room`,
                materials: materialsParam ? JSON.parse(materialsParam) : [
                    {
                        __typename: MaterialTypename.Iframe,
                        name: `Interactive video`,
                        url: `/h5p/play/60588e7475aa32001244926f`,
                    },
                    {
                        __typename: MaterialTypename.Iframe,
                        name: `Course Presentation`,
                        url: `/h5p/play/60588da62af9710014707a2d`,
                    },
                    {
                        __typename: MaterialTypename.Iframe,
                        name: `Drag and drop`,
                        url: `/h5p/play/60589f9375aa32001244928a`,
                    },
                    {
                        __typename: MaterialTypename.Iframe,
                        name: `Memory Game`,
                        url: `/h5p/play/605891d02af9710014707a44`,
                    },
                    {
                        __typename: MaterialTypename.Iframe,
                        name: `Fruit`,
                        url: `/h5p/play/604afe4c75aa320012448fca`,
                    },
                    {
                        __typename: MaterialTypename.Video,
                        name: `Video`,
                        url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || `.`}/test_video.mp4`,
                    },
                    {
                        __typename: MaterialTypename.Audio,
                        name: `Audio`,
                        url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || `.`}/test_audio.m4a`,
                    },
                    {
                        __typename: MaterialTypename.Image,
                        name: `Portrait Image`,
                        url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || `.`}/test_image-1.jpeg`,
                    },
                    {
                        __typename: MaterialTypename.Image,
                        name: `Landscape Image`,
                        url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || `.`}/test_image-2.jpeg`,
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
    } catch (e) { }
    return;
}
