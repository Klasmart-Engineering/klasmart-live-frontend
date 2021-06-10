const params = new URLSearchParams(window.location.search);
const pdfUrl = new URL(decodeURI(params.get(`pdfSrc`) ?? ``));

const pdfServiceEndpoint = process.env.ENDPOINT_PDF || `http://localhost:32891`;
console.log(pdfServiceEndpoint);

const pageContainer = document.getElementById(`viewerContainer`);

if (!pageContainer) throw new Error(`Could not find the PDF container element!`);

const getPDFPages = async (endpoint: string, pdfUrl: URL) => {
    console.log(`Retrieving PDF pages`);
    const pdfName = pdfUrl.pathname.split(`/`).pop();
    const requestURL = `${pdfServiceEndpoint}/assets/${pdfName}/pages?pdfURL=${pdfUrl.toString()}`;
    console.log(requestURL);

    const response = await fetch(requestURL);
    const { pages } = await response.json();
    return pages;
};

const createImageArray = (endpoint: string, pdfUrl: URL, pageCount: number) => {
    const pdfName = pdfUrl.pathname.split(`/`).pop() ?? ``;
    const imageElements = [];

    for(let i = 1; i <= pageCount; i++) {
        const e = document.createElement(`img`);
        const imageSrc = createPageURL(pdfName, pdfUrl, i);
        // Only eagerly load the first page
        e.setAttribute(`loading`, i > 1 ? `lazy` : `eager`);
        e.setAttribute(`src`, imageSrc);
        e.addEventListener('load', () => {
            console.log(`load event for page ${i}`);
        });
        e.addEventListener('loadeddata', () => {
            console.log(`loadeddata event for page ${i}`);
        });
        imageElements.push(e);
    }

    return imageElements;
};

const createPageURL = (pdfName: string, pdfUrl: URL, page: number) => {
    return `${pdfServiceEndpoint}/assets/${pdfName}/pages/${page}?pdfURL=${pdfUrl.toString()}`;
};

const clearContainer = (container: HTMLElement) => {
    while (container.firstChild) {
        container.firstChild.remove();
    }
};

const populatePages = (container: HTMLElement, images: HTMLElement[]) => {
    const [ firstImage, ...otherImages ] = images;
    firstImage.addEventListener('load', () => {
        otherImages.forEach(i => container.appendChild(i));
    });
    container.appendChild(firstImage);
};

const initializePDF = async (pdfUrl: URL) => {
    const pages = await getPDFPages(pdfServiceEndpoint, pdfUrl);
    console.log(`Pages total: ${pages}`);
    const images = createImageArray(pdfServiceEndpoint, pdfUrl, pages);
    console.log(images);
    clearContainer(pageContainer);
    populatePages(pageContainer, images);
};

initializePDF(pdfUrl);
