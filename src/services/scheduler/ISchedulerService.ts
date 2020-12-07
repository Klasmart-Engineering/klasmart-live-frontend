
export type TimeView = "day" | "work_week" | "week" | "month";

export interface ISchedulerService {
    // TODO (Axel): Implement parameters to comply with: https://swagger-ui.kidsloop.net/#/schedule/getScheduleTimeView
    // TODO (Axel): Implement proper return type.
    getScheduleTimeViews(organizationId: string, viewType: TimeView, timeAt: number, timeZoneOffset: number): Promise<any>
}