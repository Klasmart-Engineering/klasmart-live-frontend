import { fetchJsonData } from "../../utils/requestUtils";
import { IAuthenticationService } from "../auth/IAuthenticationService";
import { ContentListResponse, ContentOrder, ContentResponse, IContentService, PublishStatus } from "./IContentService";

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
}
