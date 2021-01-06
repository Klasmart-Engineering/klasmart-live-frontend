import { ScheduleDetail } from "../../store/reducers/data";

export type TimeView = "day" | "work_week" | "week" | "month";

export type ScheduleTimeViewResponse = {
    class_id: string,
    class_type: string,
    end_at: number,
    id: string,
    is_repeat: boolean,
    lesson_plan_id: string,
    start_at: number,
    status: string,
    title: string
}

export enum ScheduleLiveTokenType {
    "live" = "live",
    "preview" = "preview"
}

export type ScheduleLiveTokenResponse = {
    token: string
}

/**
 * Client side API interface for: https://swagger-ui.kidsloop.net/#/schedule
 */
export interface ISchedulerService {
    // TODO (Axel): Implement parameters to comply with: https://swagger-ui.kidsloop.net/#/schedule/getScheduleTimeView
    getScheduleTimeViews(organizationId: string, viewType: TimeView, timeAt: number, timeZoneOffset: number): Promise<ScheduleTimeViewResponse[]>

    // TODO (Axel): Implement full response type.
    getScheduleInfo(organizationId: string, scheduleId: string): Promise<ScheduleDetail>;

    getScheduleToken(organizationId: string, scheduleId: string): Promise<ScheduleLiveTokenResponse>;
}