export type ForeignIdName = { id: string; name: string }

export enum ScheduleTimeViewStatus {
    NOT_START = "NotStart",
    STARTED = "Started",
    CLOSED = "Closed"
}

export enum ScheduleClassType {
    LIVE = "OnlineClass", // live
    CLASSES = "OfflineClass", // classes
    STUDY = "Homework", // study
    TASK = "Task" // task
}

type ScheduleRepeatType = "daily" | "weekly" | "monthly" | "yearly";
type ScheduleRepeatDetail = { end: any, interval?: number } // TODO (Isu): Sync with CMS API's recent update
type ScheduleRepeat = {
    type?: ScheduleRepeatType,
    daily: ScheduleRepeatDetail,
    weekly: ScheduleRepeatDetail,
    monthly: ScheduleRepeatDetail,
    yearly: ScheduleRepeatDetail
}

export type ScheduleTimeViewResponse = {
    class_id: string,
    class_type: string,
    due_at: number,
    end_at: number,
    id: string,
    is_home_fun: boolean,
    is_repeat: boolean,
    lesson_plan_id: string,
    start_at: number,
    status: ScheduleTimeViewStatus,
    title: string
}

export interface ScheduleResponse {
    attachment: ForeignIdName
    class: ForeignIdName
    class_roster_student: any // TODO
    class_roster_teacher: any // TODO
    class_type: ScheduleClassType
    description: string
    due_at: number
    end_at: number
    id: string
    is_all_day: boolean
    is_repeat: boolean
    is_home_fun: boolean
    exist_feedback: boolean
    lesson_plan: ForeignIdName
    member_teachers: ForeignIdName[]
    org_id: string
    participants_student: any // TODO
    participants_teacher: any // TODO
    program: ForeignIdName
    real_time_status: { id: string, lesson_plan_is_auth: boolean }
    repeat: ScheduleRepeat
    start_at: number
    student_count: number
    subject: ForeignIdName
    teachers: ForeignIdName[]
    title: string
    version: number
}

export enum TimeView {
    MONTH = "month",
    WEEK = "week",
    WORK_WEEK = "work_week",
    DAY = "day",
    FULL_VIEW = "full_view"
}

export enum ScheduleLiveTokenType {
    LIVE = "live",
    PREVIEW = "preview"
}

export type ScheduleLiveTokenResponse = {
    token: string
}

/**
 * Client side API interface for: https://swagger-ui.kidsloop.net/#/schedule
 */
export interface ISchedulerService {
    // TODO (Axel): Implement parameters to comply with: https://swagger-ui.kidsloop.net/#/schedule/getScheduleTimeView
    getScheduleTimeViews(organizationId: string, viewType: TimeView, timeAt: number, timeZoneOffset: number, class_types?: ScheduleClassType): Promise<ScheduleTimeViewResponse[]>
    getAnytimeStudyScheduleTimeViews(organizationId: string): Promise<ScheduleTimeViewResponse[]>;

    // TODO (Axel): Implement full response type.
    getScheduleInfo(organizationId: string, scheduleId: string): Promise<ScheduleResponse>;

    getScheduleToken(organizationId: string, scheduleId: string): Promise<ScheduleLiveTokenResponse>;
}