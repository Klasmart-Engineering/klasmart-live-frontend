"use strict";

const scaleLiterals = [
    `page-width`,
    `actual-size`,
    `automatic-zoom`,
    `page-fit`,
];

const params = new URLSearchParams(window.location.search);

// ! Configurable query parameters
let scale = params.get(`scale`) || scaleLiterals[0];
const pdfSrc = params.get(`pdfSrc`); // Required
const useLinkService = params.get(`linkService`) || false;

if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
// eslint-disable-next-line no-alert
    alert(`Please build the pdfjs-dist library using\n  \`gulp dist-install\``);
}

// Some PDFs need external cmaps.
const CMAP_URL = `pdfjs-dist/cmaps/`;
const CMAP_PACKED = true;

const DEFAULT_URL = pdfSrc;

const container = document.getElementById(`viewerContainer`);

const eventBus = new pdfjsViewer.EventBus();

let pdfLinkService = useLinkService
    ? new pdfjsViewer.PDFLinkService({ eventBus })
    : undefined;

const pdfViewerParams = {
    container,
    eventBus,
    renderer: `svg`,
    textLayerMode: 0,
    linkService: pdfLinkService,
};

const pdfViewer = new pdfjsViewer.PDFViewer(pdfViewerParams);

if (pdfLinkService) pdfLinkService.setViewer(pdfViewer);

// validate scale
if (typeof scale !== `number` && !scaleLiterals.includes(scale)) {
    console.warn(`Unknown scale literal: ${scale}. Defaulting to ${scaleLiterals[0]}`);
    scale = scaleLiterals[0];
}
eventBus.on(`pagesinit`, function () {
// We can use pdfViewer now, e.g. let's change default scale.
  pdfViewer.currentScaleValue = scale;
});

// Loading document.
const loadingTask = pdfjsLib.getDocument({
    url: DEFAULT_URL,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED,
    fontExtraProperties: true,
});

loadingTask.promise.then(function (pdfDocument) {
// Document loaded, specifying document for the viewer and
// the (optional) linkService.
    console.log(pdfDocument);
    pdfViewer.setDocument(pdfDocument);
    if (pdfLinkService) pdfLinkService.setDocument(pdfDocument, null);
});
