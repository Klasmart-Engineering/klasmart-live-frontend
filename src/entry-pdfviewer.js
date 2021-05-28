
"use strict";

const scaleLiterals = [
    `page-width`,
    `actual-size`,
    `automatic-zoom`,
    `page-fit`,
];
let documentSet = false;
console.log(`loading PDF view`);
let currentPdfAddress = undefined;

const params = new URLSearchParams(window.location.search);
let scale = params.get(`scale`);
const pdfSrc = params.get(`pdfSrc`);

console.log(params);

if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
// eslint-disable-next-line no-alert
    alert(`Please build the pdfjs-dist library using\n  \`gulp dist-install\``);
}
// The workerSrc property shall be specified.

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "../../node_modules/pdfjs-dist/build/pdf.worker.js";

// Some PDFs need external cmaps.

const CMAP_URL = `../../node_modules/pdfjs-dist/cmaps/`;
const CMAP_PACKED = true;

const DEFAULT_URL = pdfSrc;

const container = document.getElementById(`viewerContainer`);

const eventBus = new pdfjsViewer.EventBus();

// (Optionally) enable hyperlinks within PDF files.
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

// validate scale
if (typeof scale !== `number` && !scaleLiterals.includes(scale)) {
    console.warn(`Unknown scale literal: ${scale}. Defaulting to ${scaleLiterals[0]}`);
    scale = scaleLiterals[0];
}
console.log('RUNNING A')
eventBus.on(`pagesinit`, function () {
// We can use pdfViewer now, e.g. let's change default scale.
  console.log('RUNNING B')
    
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

    pdfViewer.setDocument(pdfDocument);
    console.log('RUNNING C')
    
    pdfLinkService.setDocument(pdfDocument, null);
});

