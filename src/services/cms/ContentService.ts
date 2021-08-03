import { fetchJsonData } from "../../utils/requestUtils";
import { instanceOfCMSErrorResponse } from "../../utils/typeUtils";
import { IAuthenticationService } from "../auth/IAuthenticationService";
import {
    CMSErrorResponse,
    ContentListResponse,
    ContentOrder, ContentResourcePartition, ContentResourceUploadResponse,
    ContentResponse,
    ContentType,
    IContentService,
    PublishStatus
} from "./IContentService";
import { shuffle } from "../../utils/arrayUtils";

const createBlobForUploading = (file: File): Promise<Blob> => {
    return new Promise<Blob>((resolve, reject) => {
        var reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as ArrayBuffer;
            var blob = new Blob([new Uint8Array(result)], { type: file.type });

            resolve(blob);
        };

        reader.onerror = () => {
            reject("couldn't read file");
        };

        reader.readAsArrayBuffer(file);
    });
}

/**
 * Client side API implementation for: https://swagger-ui.kidsloop.net/#/content
 */
export class ContentService implements IContentService {
    private endpoint: string;
    private auth: IAuthenticationService;

    constructor(endpoint: string, auth: IAuthenticationService) {
        this.endpoint = endpoint;
        this.auth = auth;
    }

    async getContentById(organizationId: string, contentId: string): Promise<ContentResponse> {
        const url = `${this.endpoint}/v1/contents/${contentId}`;
        const result = await fetchJsonData<ContentResponse>(url, "GET", {
            org_id: organizationId
        }, this.auth);

        return result;
    }

    async searchContents(organizationId: string, publishStatus: PublishStatus, orderBy: ContentOrder, contentType: number): Promise<ContentListResponse> {
        const url = `${this.endpoint}/v1/contents`;
        const result = await fetchJsonData<ContentListResponse>(url, "GET", {
            publish_status: publishStatus,
            order_by: orderBy,
            content_type: contentType,
            org_id: organizationId
        }, this.auth);

        return result;
    }

    async getFeaturedContents(organizationId: string): Promise<ContentListResponse> {
        const url = `${this.endpoint}/v1/contents`;
        const result = await fetchJsonData<ContentListResponse | CMSErrorResponse>(url, "GET", {
            publish_status: PublishStatus.PUBLISHED,
            order_by: ContentOrder.BY_UPDATE_AT,
            content_type: ContentType.MATERIAL,
            org_id: organizationId
        }, this.auth);

        if (instanceOfCMSErrorResponse(result)) {
            return {
                err: {
                    // code: 400 // TODO (Isu)
                    message: result.label,
                },
                total: 0,
                list: [],
            };
        }

        if (result.total === 0) {
            return result;
        }

        const n = 10;
        const allContents = result.list;

        // TODO (Isu): Except materials of the current Study Lesson Plan
        // TODO (Isu): Support non H5P
        const H5PContents = allContents.filter((content: ContentResponse) => {
            const data = JSON.parse(content.data);
            return data && data.file_type === 5; // TODO (Isu): Figure out the number of file_types and create enum as type
        })

        // Shuffle
        const shuffled = shuffle(H5PContents);

        // Put all self_study items to the front of array
        shuffled.sort((a, b) => (a.self_study === b.self_study) ? 0 : (a ? -1 : 1))

        // Random pick 10 contents: Get sub-array of first n elements after shuffled
        const picked = shuffled.slice(0, n);

        return {
            total: n,
            list: picked,
        };
    }

    // https://swagger-ui.kidsloop.net/#/content/searchContents
    async getAllLessonMaterials(organizationId: string): Promise<ContentListResponse> {
        const url = `${this.endpoint}/v1/contents`;
        const result = await fetchJsonData<ContentListResponse>(url, "GET", {
            publish_status: PublishStatus.PUBLISHED,
            order_by: ContentOrder.BY_UPDATE_AT,
            content_type: ContentType.MATERIAL,
            org_id: organizationId
        }, this.auth);

        return result;
    }

    async getContentResourceUploadPath(organizationId: string, extension: string): Promise<ContentResourceUploadResponse> {
        const url = `${this.endpoint}/v1/contents_resources`;
        const result = await fetchJsonData<ContentResourceUploadResponse>(url, "GET", {
            partition: ContentResourcePartition.SCHEDULE_ATTACHMENT,
            extension: extension,
            org_id: organizationId
        }, this.auth);

        return result;
    }

    uploadAttachment(path: string, file: File): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            createBlobForUploading(file).then(blob => {
                var uploadRequest = new XMLHttpRequest();
                uploadRequest.open("PUT", path, true);

                uploadRequest.onreadystatechange = () => {
                    // NOTE: readyState 4 == DONE (iOS)
                    if (uploadRequest.readyState === XMLHttpRequest.DONE ||
                        uploadRequest.readyState === 4) {
                        resolve(true);
                    }
                };

                uploadRequest.onerror = () => {
                    reject(uploadRequest.statusText);
                }

                uploadRequest.ontimeout = () => {
                    reject(`timeout`);
                }

                uploadRequest.send(blob);
            }).catch(error => {
                reject(error);
            });
        });

        /* NOTE: This code was causing errors on iOS when trying to upload files. I'm keeping it here in case we'll have to use it for Android later.
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Length", file.size.toString());
        headers.append("Content-Type", file.type);

        const response = await fetch(path, {
            method: "PUT",
            headers,
            body: file
        })
        if(!response.ok){
            throw new Error(response.statusText);
        }
        return true; */
    }
}
