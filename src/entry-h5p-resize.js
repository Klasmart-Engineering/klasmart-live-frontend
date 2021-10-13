"use strict";

if (window.H5PRESIZELOADED) {
    return;
}

window.H5PRESIZELOADED = true;

if (H5P) {
    window.addEventListener(`h5p-iframe-changed-size`, () => {
        if (!H5P) {
            console.error(`H5P not available on this page.`);
            return;
        }

        console.log(`trigger resize`);

        H5P.trigger(H5P.instances[0], `resize`);
    }, false);

    console.log(`trigger resize`);
    H5P.trigger(H5P.instances[0], `resize`);
}
