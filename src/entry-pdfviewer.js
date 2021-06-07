"use strict";

const scaleLiterals = [
    `page-width`,
    `actual-size`,
    `automatic-zoom`,
    `page-fit`,
];

const params = new URLSearchParams(window.location.search);
let scale = params.get(`scale`);
const pdfSrc = params.get(`pdfSrc`);

if (!pdfjsLib.getDocument || !pdfjsViewer.pdfjsViewer) {
    console.warn(`Please build the pdfjs-dist library using\n \`gulp dist-install\``);
}

const CMAP_URL = `pdfjs-dist/cmaps/`;
const CMAP_PACKED = true;
const DEFAULT_URL = pdfSrc;

const container = document.getElementById(`viewerContainer`);
const eventBus = new pdfjsViewer.EventBus();

const pdfLinkService = new pdfjsViewer.PDFLinkService({
    eventBus,
});

const pdfViewer = new pdfjsViewer.PDFViewer({
    container,
    eventBus,
    linkService: pdfLinkService,
    renderer: `svg`,
    textLayerMode: 0,
    embedFonts: true,
});
pdfLinkService.setViewer(pdfViewer);

if (!scale) scale = scaleLiterals[0];

if (typeof scale !== `number` && !scaleLiterals.includes(scale)) {
    console.warn(`Unknown scale literal: ${scale}. Defaulting to ${scaleLiterals[0]}`);
    scale = scaleLiterals[0];
}

eventBus.on(`pagesinit`, function () {
    pdfViewer.currentScaleValue = scale;
});

const loadingTask = pdfjsLib.getDocument({
    url: DEFAULT_URL,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED,
    fontExtraProperties: true,
});

loadingTask.promise.then(function (pdfDocument) {
    pdfViewer.setDocument(pdfDocument);
    pdfLinkService.setDocument(pdfDocument, null);
});

