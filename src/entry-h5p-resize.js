"use strict";

window.addEventListener("h5p-iframe-changed-size", () => {
    if (!H5P) {
        console.error("H5P not available on this page.");
        return;
    }

    H5P.trigger(H5P.instances[0], "resize");
}, false);

H5P.trigger(H5P.instances[0], "resize");
