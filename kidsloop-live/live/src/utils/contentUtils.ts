import { useEffect, useState } from "react";
import { LessonMaterial } from "../lessonMaterialContext";
import { Content } from "../room";

export const useMaterialToHref = function (material?: LessonMaterial) {
    const [href, setHref] = useState<string>("");

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
            const result = new URL(contentUrl, process.env.ENDPOINT_CONTENT);

            setHref(result.href);
        } catch (err) {
            console.error(err);
            setHref(contentUrl);
        }
    }, [material]);

    return [href];
}

export const useContentToHref = function (content?: Content) {
    const [href, setHref] = useState<string>("");

    useEffect(() => {
        if (content === undefined) {
            setHref("");
            return;
        }

        try {
            // new URL will combine the url and base if url is relative. Otherwise it will
            // ignore the base component. This allow the contentId to be both absolute and
            // relative paths.
            const result = new URL(content.contentId, process.env.ENDPOINT_CONTENT);

            setHref(result.href);
        } catch (err) {
            console.error(err);
            setHref(content.contentId);
        }
    }, [content]);

    return [href];
}
