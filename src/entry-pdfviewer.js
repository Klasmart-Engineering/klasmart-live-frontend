"use strict";

console.log('loading PDF view');
window.addEventListener('message', (payload) => {
  const {data} = payload
  console.log(`message received`);
  console.log(payload);
  if(!data.pdfSrc) {
    return;
  }
  if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
    // eslint-disable-next-line no-alert
    alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
  }
  // The workerSrc property shall be specified.
  
  // pdfjsLib.GlobalWorkerOptions.workerSrc =
  //   "../../node_modules/pdfjs-dist/build/pdf.worker.js";
  
  // Some PDFs need external cmaps.
  
  const CMAP_URL = "../../node_modules/pdfjs-dist/cmaps/";
  const CMAP_PACKED = true;
  
  const DEFAULT_URL = data.pdfSrc;
  
  const container = document.getElementById("viewerContainer");
  
  const eventBus = new pdfjsViewer.EventBus();
  
  // (Optionally) enable hyperlinks within PDF files.
  const pdfLinkService = new pdfjsViewer.PDFLinkService({
    eventBus,
  });

  const pdfViewer = new pdfjsViewer.PDFViewer({
    container,
    eventBus,
    linkService: pdfLinkService,
    renderer: "svg",
    textLayerMode: 0,
    embedFonts: true
  });
  pdfLinkService.setViewer(pdfViewer);

  if (!data.scale) data.scale = scaleLiterals[0]

  // validate scale
  if (typeof data.scale !== 'number' && !scaleLiterals.includes(data.scale)) {
    console.warn(`Unknown scale literal: ${data.scale}. Defaulting to ${scaleLiterals[0]}`)
    data.scale = scaleLiterals[0];
  }

  eventBus.on("pagesinit", function () {
    // We can use pdfViewer now, e.g. let's change default scale.
    pdfViewer.currentScaleValue = data.scale;
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
  
    pdfLinkService.setDocument(pdfDocument, null);
  });
});

const scaleLiterals = [
  'page-width',
  'actual-size',
  'automatic-zoom',
  'page-fit'
];

// Testing Configuration - Forces display of content from a test PDF server
// const pdfTest = false;
// const samplePdfs = ['a', 'b', 'c', 'd'];
// const selection = samplePdfs[Math.floor(Math.random() * 4)];
// const data = {
//   pdfSrc: `http://localhost:3000/api/pdf/${selection}.pdf`,
//   scale: 'page-width'
// }

// if (pdfTest) {
//   window.postMessage(data, '*');
// } 
