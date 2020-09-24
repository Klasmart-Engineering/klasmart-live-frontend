// TODO (Isu): Move to correct file
type GeneralError = {
    code?: number,
    message: string,
}

export interface CMSErrorResponse {
    data: any,
    label: string
}

type LearningOutcome = {
    age: string,
    ancestor_id: string,
    assumed: boolean,
    author: string,
    author_name: string,
    created_at: number,
    deleted_at: number,
    description: string,
    developmental: string,
    extra: number,
    grade: string,
    keywords: string,
    latest_id: string,
    locked_by: string,
    organization_id: string,
    outcome_id: string,
    outcome_name: string,
    program: string,
    publish_scope: string,
    publish_status: string,
    reject_reason: string,
    shortcode: string,
    skills: string,
    source_id: string,
    subject: string,
    updated_at: number,
    version: number
}

export type ContentResponse = {
    age: string[],
    age_name: string[],
    author: string,
    author_name: string,
    content_type: number, // == enum ContentType
    content_type_name: string,
    created_at: number,
    creator: string,
    creator_name: string,
    data: string,
    description: string,
    developmental: string[],
    developmental_name: string[],
    draw_activity: boolean,
    extra: string,
    grade: string[],
    grade_name: string[],
    id: string,
    is_mine: boolean,
    keywords: string[],
    latest_id: string,
    lesson_type: string,
    lesson_type_name: string,
    locked_by: string,
    name: string,
    org: string,
    org_name: string,
    outcome_entities: LearningOutcome[],
    outcomes: string[],
    program: string,
    program_name: string,
    publish_scope: string,
    publish_scope_name: string,
    publish_status: string,
    reject_reason: string[],
    remark: string,
    self_study: true,
    skills: string[],
    skills_name: string[],
    source_id: string,
    source_type: string,
    subject: string[],
    subject_name: string[],
    suggest_time: number,
    teacher_manual: string,
    teacher_manual_name: string,
    thumbnail: string,
    updated_at: number,
    version: number
}

export type ContentListResponse = {
    err?: GeneralError,

    total: number,
    list: ContentResponse[]
}

export enum ContentType {
    MATERIAL = 1,
    PLAN = 2
}

export enum PublishStatus {
    PUBLISHED = "published",
    DRAFT = "draft",
    PENDING = "pending",
    REJECTED = "rejected",
    ARCHIVE = "archive"
}

export enum ContentOrder {
    BY_ID = "id",
    BY_DESC_ID = "-id",
    BY_CONTENT_NAME = "content_name",
    BY_DESC_CONTENT_NAME = "-content_name",
    BY_CREATE_AT = "create_at",
    BY_DESC_CREATE_AT = "-create_at",
    BY_UPDATE_AT = "update_at",
    BY_DESC_UPDATE_AT = "-update_at"
}

/**
 * Client side API interface for: https://swagger-ui.kidsloop.net/#/content
 */
export interface IContentService {
    getContentById(organizationId: string, contentId: string): Promise<ContentResponse>

    // https://swagger-ui.kidsloop.net/#/content/searchContents
    searchContents(organizationId: string, publishStatus: PublishStatus, orderBy: ContentOrder, contentType: number): Promise<ContentListResponse>
    getFeaturedContents(organizationId: string): Promise<ContentListResponse>
}