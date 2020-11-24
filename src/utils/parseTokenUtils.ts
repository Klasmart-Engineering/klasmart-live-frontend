import jwt_decode from "jwt-decode";
import { MaterialTypename } from "../lessonMaterialContext";

const url = new URL(window.location.href)

function shouldUseTestToken() {
    const useTestToken = process.env.USE_TEST_TOKEN !== undefined;
    return (useTestToken || url.hostname === "localhost" || url.hostname === "live.kidsloop.net" || url.hostname.includes("ngrok.io"));
}

function parseParamsFromUrlQuery() {
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

function parseParamsFromToken(token?: string) {
    if (!token) { return; }

    try {
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
        // eslint-disable-next-line no-empty
    } catch (e) { }
    return;
}

export function parseTokenParams(token?: string) {
    if (!token) {
        token = url.searchParams.get("token") || undefined;
    }

    if (shouldUseTestToken() && token === null) {
        return parseParamsFromUrlQuery();
    }

    return parseParamsFromToken(token);
}