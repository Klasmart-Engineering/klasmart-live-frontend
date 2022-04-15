export interface PDFMetadataDTO {
    totalPages: number;
    outline?: PDFInternalOutlineTree;
    pageLabels?: string[];
}

export type PDFInternalOutlineTree = PDFInternalOutlineRecord[];

export interface PDFInternalOutlineRecord {
    title: string;
    bold: boolean;
    italic: boolean;
    color: Uint8ClampedArray;
    page: number;
    dest: string | any[] | undefined;
    url: string | undefined;
    unsafeUrl: string | undefined;
    newWindow: boolean | undefined;
    count: number | undefined;
    items: PDFInternalOutlineRecord[];
}

export async function getPdfMetadata (pdfPath: string, endpoint: string) {
    let data: any = {};

    const headers = new Headers();
    headers.append(`Accept`, `application/json`);
    headers.append(`Content-Type`, `application/json`);

    const fetchUrl = `${endpoint}/v2${pdfPath}/metadata`;

    const isLocal = window.location.href.indexOf(`localhost`) > 0;

    try{
        const response = await fetch(fetchUrl, {
            headers,
            method: `GET`,
            credentials: isLocal ? `same-origin` : `include`,
        });
        data = await response.json();
    } catch (err) {
        console.error(`Fail getPdfMetadata: ${err}`);
    }

    return data;
}

export function scrollToPage (pageId: number) {
    document.getElementById(`pdf-page-${pageId}`)?.scrollIntoView();
}
