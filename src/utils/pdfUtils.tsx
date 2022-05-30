export interface PDFMetadataDTO {
    totalPages: number;
    outline?: PDFInternalOutlineTree;
    pageLabels?: string[];
    status?: string
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

const MAX_RETRY = 3;
let CURRENT_ATTEMPT_COUNT = 0;

export async function getPdfMetadata (pdfPath: string, endpoint: string) {
    return new Promise<PDFMetadataDTO>((resolve,reject) => {
        getPdfMetadataMiddleware(pdfPath,endpoint,resolve,reject);
    });
}

async function getPdfMetadataMiddleware (pdfPath: string, endpoint: string,resolve:any,reject:any) {
    const data = await getPdfMetadataCall(pdfPath,endpoint,resolve);
    CURRENT_ATTEMPT_COUNT++;
    if (data.status != undefined && data.status === `500`) {
        if (CURRENT_ATTEMPT_COUNT < MAX_RETRY) {
            setTimeout(() => { 
                getPdfMetadataMiddleware(pdfPath,endpoint,resolve,reject);
            }, 100);

        } else {
            reject(data);
        }
        
    } else {
        resolve(data);
    }
}

export async function getPdfMetadataCall (pdfPath: string, endpoint: string,resolve:any) {
    let data: any = {};
    const headers = new Headers();
    headers.append(`Accept`, `application/json`);
    headers.append(`Content-Type`, `application/json`);

    const fetchUrl = `${endpoint}/v2${pdfPath}/metadata`;

    const isLocal = window.location.href.indexOf(`localhost`) > 0;
    try {
        const response = await fetch(fetchUrl, {
            headers,
            method: `GET`,
            credentials: isLocal ? `same-origin` : `include`,
        });
        data = await response.json();
    } catch (err) {
        data = {
            status: `500`,
        };
    }
    return data; 
}

export function scrollToPage (pageId: number) {
    document.getElementById(`pdf-page-${pageId}`)?.scrollIntoView();
}
