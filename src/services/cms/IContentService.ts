
// TODO (Axel): This response is based on the usage code I saw in join.tsx for now. We'll have to 
// ensure it's compatible with the swagger API specification later.
export type ContentResponse = {
    data: string
}

export type ContentListResponse = {
    list: ContentResponse[]
}

export type PublishStatus = "published" | "draft" | "pending" | "rejected" | "archive";
export type ContentOrder = "id" |"-id" | "content_name" |"-content_name" | "create_at" | "-create_at" | "update_at" | "-update_at";

/**
 * Client side API interface for: https://swagger-ui.kidsloop.net/#/content
 */
export interface IContentService {
    getContentById(organizationId: string, contentId: string): Promise<ContentResponse>

    // https://swagger-ui.kidsloop.net/#/content/searchContents
    searchContents(organizationId: string, publishStatus: PublishStatus, orderBy: ContentOrder, contentType: number): Promise<ContentListResponse>
}