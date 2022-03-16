import React from "react";

export default function VersionPage () {
    const obj = {
        GIT_COMMIT: process.env.GIT_COMMIT,
        VERSION: process.env.VERSION,
    };

    return (
        <pre>{JSON.stringify(obj, null, 2)}</pre>
    );
}
