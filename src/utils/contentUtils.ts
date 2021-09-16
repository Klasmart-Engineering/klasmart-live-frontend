import { Content } from "@/pages/utils";
import { useHttpEndpoint } from "@/providers/region-select-context";
import { LessonMaterial } from "@/types/lessonMaterial";
import { useEffect, useState } from "react";

export const getContentHref = function (path: string, endpoint: string) {
    let result = path;
    try {
        // new URL will combine the url and base if url is relative. Otherwise it will
        // ignore the base component. This allow the contentId to be both absolute and
        // relative paths.
        const url = new URL(path, endpoint);

        result = url.href;
    } catch (err) {
        console.error(err);
        result = path;
    }

    return result;
};

export const useMaterialToHref = function (material?: LessonMaterial) {
    const [href, setHref] = useState<string>("");
    const contentEndpoint = useHttpEndpoint("live");

    useEffect(() => {
        if (material === undefined) {
            setHref("");
            return;
        }

        const contentUrl = material.__typename === undefined && material.video ? material.video : material.url;
        if (!contentUrl) {
            setHref("");
            return;
        }

        try {
            // new URL will combine the url and base if url is relative. Otherwise it will
            // ignore the base component. This allow the contentId to be both absolute and
            // relative paths.
            const result = new URL(contentUrl, contentEndpoint);

            setHref(result.href);
        } catch (err) {
            console.error(err);
            setHref(contentUrl);
        }
    }, [material, contentEndpoint]);

    return [href];
}

export const useContentToHref = function (content?: Content) {
    const [href, setHref] = useState<string>("");
    const contentEndpoint = useHttpEndpoint("live");

    useEffect(() => {
        if (content === undefined) {
            setHref("");
            return;
        }

        try {
            // new URL will combine the url and base if url is relative. Otherwise it will
            // ignore the base component. This allow the contentId to be both absolute and
            // relative paths.
            const result = new URL(content.contentId, contentEndpoint);

            setHref(result.href);
        } catch (err) {
            console.error(err);
            setHref(content.contentId);
        }
    }, [content, contentEndpoint]);

    return [href];
}
