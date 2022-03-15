import
{ useEffect } from "react";

export const useInterval = (f?: {():unknown}, ms?: number | undefined) =>
    useEffect(() => {
        if(!f) { return; }
        const handle = setInterval(f, ms);
        return () => clearInterval(handle);
    }, [ f, ms ]);
