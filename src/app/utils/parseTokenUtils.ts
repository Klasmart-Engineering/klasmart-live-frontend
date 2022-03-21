/* eslint-disable @typescript-eslint/naming-convention */
import { MaterialTypename } from "../../types/lessonMaterial";
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
    user_id: string;
    is_review?: boolean;
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
                __typename: MaterialTypename.IFRAME,
                name: `Pairs`,
                url: `/h5p/play/5ecf4e4b611e18398f7380ef`,
            },
            {
                __typename: MaterialTypename.IFRAME,
                name: `Flashcards`,
                url: `/h5p/play/5ed05dd1611e18398f7380f4`,
            },
            {
                __typename: MaterialTypename.IFRAME,
                name: `Drag and Drop`,
                url: `/h5p/play/5ed0b64a611e18398f7380fb`,
            },
            {
                __typename: MaterialTypename.IFRAME,
                name: `Hot Spot 1`,
                url: `/h5p/play/5ecf6f43611e18398f7380f0`,
            },
            {
                __typename: MaterialTypename.IFRAME,
                name: `Hot Spot 2`,
                url: `/h5p/play/5ed0a79d611e18398f7380f7`,
            },
            {
                __typename: MaterialTypename.VIDEO,
                name: `Video`,
                url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || `.`}/test_video.mp4`,
            },
            {
                __typename: MaterialTypename.AUDIO,
                name: `Audio`,
                url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || `.`}/test_audio.m4a`,
            },
            {
                __typename: MaterialTypename.IMAGE,
                name: `Portrait Image`,
                url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || `.`}/test_image_portrait.jpg`,
            },
            {
                __typename: MaterialTypename.IMAGE,
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
                __typename: MaterialTypename.IFRAME,
                name: `Quiz`,
                url: `/h5p/play/5ed07656611e18398f7380f6`,
            },
        ],
        org_id: url.searchParams.get(`org_id`) || ``,
        schedule_id: url.searchParams.get(`schedule_id`) || ``,
        classtype: url.searchParams.get(`classtype`) || `live`,
        user_id: url.searchParams.get(`user_id`) || ``,
        is_review: url.searchParams.get(`is_review`) !== null,
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
                    __typename: MaterialTypename.IFRAME,
                    name: mat.name,
                    url: mat.url,
                };
            } else if (mat.__typename === `Video`) {
                return {
                    __typename: MaterialTypename.VIDEO,
                    name: mat.name,
                    url: mat.url,
                };
            } else if (mat.__typename === `Audio`) {
                return {
                    __typename: MaterialTypename.AUDIO,
                    name: mat.name,
                    url: mat.url,
                };
            } else if (mat.__typename === `Image`) {
                return {
                    __typename: MaterialTypename.IMAGE,
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
            user_id: String(payload.user_id) || ``,
            is_review: payload.is_review ? Boolean(payload.is_review) : false,
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
