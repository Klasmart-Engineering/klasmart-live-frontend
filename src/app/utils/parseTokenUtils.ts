import { MaterialTypename } from "../../lessonMaterialContext";
import jwt_decode from "jwt-decode";

type MaterialDto = {
    __typename: "Iframe" | "Video" | "Audio" | "Image";
    name: string;
    url: string;
}

type TokenDto = {
    name?: string;
    roomid?: string;
    teacher?: boolean;
    classtype?: string;
    org_id?: string;
    schedule_id?: string;
    materials: MaterialDto[];
}

const url = new URL(window.location.href);

function shouldUseTestToken () {
    const useTestToken = process.env.USE_TEST_TOKEN !== undefined;
    return (useTestToken || url.hostname === `localhost` || url.hostname === `live.kidsloop.net` || url.hostname.includes(`ngrok.io`));
}

function parseParamsFromUrlQuery () {
    const materialsParam = url.searchParams.get(`materials`);

    return {
        teacher: url.searchParams.get(`teacher`) !== null,
        name: url.searchParams.get(`name`) || undefined, // Should be undefined not null
        roomId: url.searchParams.get(`roomId`) || `app-room`,
        materials: materialsParam ? JSON.parse(materialsParam) : [
            {
                __typename: MaterialTypename.Iframe,
                name: `Pairs`,
                url: `/h5p/play/5ecf4e4b611e18398f7380ef`,
            },
            {
                __typename: MaterialTypename.Iframe,
                name: `Flashcards`,
                url: `/h5p/play/5ed05dd1611e18398f7380f4`,
            },
            {
                __typename: MaterialTypename.Iframe,
                name: `Drag and Drop`,
                url: `/h5p/play/5ed0b64a611e18398f7380fb`,
            },
            {
                __typename: MaterialTypename.Iframe,
                name: `Hot Spot 1`,
                url: `/h5p/play/5ecf6f43611e18398f7380f0`,
            },
            {
                __typename: MaterialTypename.Iframe,
                name: `Hot Spot 2`,
                url: `/h5p/play/5ed0a79d611e18398f7380f7`,
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
                url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || `.`}/test_image_portrait.jpg`,
            },
            {
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
            {
                __typename: MaterialTypename.Iframe,
                name: `Quiz`,
                url: `/h5p/play/5ed07656611e18398f7380f6`,
            },
        ],
        org_id: url.searchParams.get(`org_id`) || ``,
        schedule_id: url.searchParams.get(`schedule_id`) || ``,
        classtype: url.searchParams.get(`classtype`) || `live`,
    };
}

function parseParamsFromToken (token?: string) {
    if (!token) { return; }

    try {
        const payload = jwt_decode<TokenDto>(token);
        const materials = payload.materials || [];
        const parsedMaterials = materials.map((mat: MaterialDto) => {
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
            teacher: payload.teacher ? Boolean(payload.teacher) : false,
            name: payload.name ? String(payload.name) : undefined,
            roomId: String(payload.roomid),
            materials: parsedMaterials || [],
        };
        // eslint-disable-next-line no-empty
    } catch (e) {
        console.warn(e);
    }
    return;
}

export function parseTokenParams (token?: string) {
    if (!token) {
        token = url.searchParams.get(`token`) || undefined;
    }

    if (shouldUseTestToken() && token === undefined) {
        return parseParamsFromUrlQuery();
    }

    return parseParamsFromToken(token);
}
