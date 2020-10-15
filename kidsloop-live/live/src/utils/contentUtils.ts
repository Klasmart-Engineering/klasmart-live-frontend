import { useEffect, useState } from "react";

const useContentIdToHref = function (contentId?: string) {
    const [href, setHref] = useState<string>("");

    useEffect(() => {
        if (contentId === undefined) {
            setHref("");
            return;
        }

        try {
            // new URL will combine the url and base if url is relative. Otherwise it will
            // ignore the base component. This allow the contentId to be both absolute and
            // relative paths.
            const result = new URL(contentId, process.env.ENDPOINT_CONTENT);

            setHref(result.href);
        } catch (err) {
            console.error(err);
            setHref(contentId);
        }
    }, [contentId]);

    return [href];
}

export default useContentIdToHref;