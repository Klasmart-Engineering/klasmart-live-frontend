const params = new URLSearchParams(window.location.search);
const src = decodeURI(params.get(`pdfSrc`) ?? ``);
const pdfServiceEndpoint = process.env.ENDPOINT_PDF || `https://live.alpha.kidsloop.net`;

const pageContainer = document.getElementById(`viewerContainer`);

if (!pageContainer) throw new Error(`Could not find the PDF container element!`);

const createPDFURL = (pdfParameter: string) => {
    console.log(pdfParameter);
    console.log(`Environment endpoint: ${process.env.ENDPOINT_PDF}`);
    // Determine if the link is relative or absolute
    if (pdfParameter.startsWith(`/`)) {
        // Force relative links in a local environment to point to live
        const host = window.location.hostname.includes(`localhost`)
            ? pdfServiceEndpoint
            : `https://${window.location.hostname}`;
        return new URL(`${host}${pdfParameter}`);
    } else {
        return new URL(pdfParameter);
    }
};

const getPDFPages = async (endpoint: string, pdfUrl: URL) => {
    console.log(`Retrieving PDF pages`);
    const pdfName = pdfUrl.pathname.split(`/`).pop();
    const requestURL = `${pdfServiceEndpoint}/pdf/${pdfName}/pages?pdfURL=${pdfUrl.toString()}`;
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
        e.addEventListener(`load`, () => {
            console.log(`load event for page ${i}`);
        });
        imageElements.push(e);
    }

    return imageElements;
};

const createPageURL = (pdfName: string, pdfUrl: URL, page: number) => {
    return `${pdfServiceEndpoint}/pdf/${pdfName}/pages/${page}?pdfURL=${pdfUrl.toString()}`;
};

const clearContainer = (container: HTMLElement) => {
    while (container.firstChild) {
        container.firstChild.remove();
    }
};

const populatePages = (container: HTMLElement, images: HTMLElement[]) => {
    const [ firstImage, ...otherImages ] = images;
    firstImage.addEventListener(`load`, () => {
        otherImages.forEach(i => container.appendChild(i));
    });
    container.appendChild(firstImage);
};

const initializePDF = async (pdfUrl: URL) => {
    const pages = await getPDFPages(pdfServiceEndpoint, pdfUrl);
    const images = createImageArray(pdfServiceEndpoint, pdfUrl, pages);
    clearContainer(pageContainer);
    populatePages(pageContainer, images);
};

const pdfUrl = createPDFURL(src);
initializePDF(pdfUrl);
