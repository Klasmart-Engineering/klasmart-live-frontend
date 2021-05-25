"use strict";

window.addEventListener('message', ({data}) => {
  if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
    // eslint-disable-next-line no-alert
    alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
  }
  // The workerSrc property shall be specified.
  //
  // pdfjsLib.GlobalWorkerOptions.workerSrc =
  //   "../../node_modules/pdfjs-dist/build/pdf.worker.js";
  
  // Some PDFs need external cmaps.
  //
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
  });
  pdfLinkService.setViewer(pdfViewer);
  
  eventBus.on("pagesinit", function () {
    // We can use pdfViewer now, e.g. let's change default scale.
    pdfViewer.currentScaleValue = "page-width";
  });
  
  // Loading document.
  const loadingTask = pdfjsLib.getDocument({
    url: DEFAULT_URL,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED,
  });
  loadingTask.promise.then(function (pdfDocument) {
    // Document loaded, specifying document for the viewer and
    // the (optional) linkService.
    pdfViewer.setDocument(pdfDocument);
  
    pdfLinkService.setDocument(pdfDocument, null);
  });

})

window.PLAYER_READY = true;
const samplePdfs = ['a', 'b', 'c', 'd'];
const selection = samplePdfs[Math.floor(Math.random() * 4)];
const data = {
  pdfSrc: `http://localhost:3000/api/pdf/${selection}.pdf`
}
window.postMessage(data, '*');