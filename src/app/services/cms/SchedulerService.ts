import { fetchJsonData } from "../../utils/requestUtils";
import { IAuthenticationService } from "../auth/IAuthenticationService";
import {
    Assignment,
    ISchedulerService,
    PostScheduleFeedbackResponse,
    ScheduleClassType,
    ScheduleFeedbackResponse,
    ScheduleLiveTokenResponse,
    ScheduleLiveTokenType,
    ScheduleResponse,
    ScheduleTimeViewResponse,
    TimeView,
} from "./ISchedulerService";

/**
 * Client side API implementation for: https://swagger-ui.kidsloop.net/#/schedule
 */
export class SchedulerService implements ISchedulerService {
    private endpoint: string;
    private auth: IAuthenticationService;

    constructor (endpoint: string, auth: IAuthenticationService) {
        this.endpoint = endpoint;
        this.auth = auth;
    }

    async getScheduleTimeViews (organizationId: string, viewType: TimeView, timeAt: number, timeZoneOffset: number, classTypes?: ScheduleClassType): Promise<ScheduleTimeViewResponse[]> {
        const url = `${this.endpoint}/v1/schedules_time_view`;
        const results = await fetchJsonData<ScheduleTimeViewResponse[]>(url, `GET`, {
            view_type: viewType,
            time_at: timeAt,
            time_zone_offset: timeZoneOffset,
            class_types: classTypes ?? ``,
            org_id: organizationId,
        }, this.auth);

        return results;
    }

    async getAnytimeStudyScheduleTimeViews (organizationId: string): Promise<ScheduleTimeViewResponse[]> {
        const url = `${this.endpoint}/v1/schedules_time_view`;
        const results = await fetchJsonData<ScheduleTimeViewResponse[]>(url, `GET`, {
            view_type: TimeView.FULL_VIEW,
            class_types: ScheduleClassType.STUDY,
            due_at_eq: 0,
            org_id: organizationId,
        }, this.auth);

        return results;
    }

    async getScheduleInfo (organizationId: string, scheduleId: string): Promise<ScheduleResponse> {
        const url = `${this.endpoint}/v1/schedules/${scheduleId}`;
        const result = await fetchJsonData<ScheduleResponse>(url, `GET`, {
            org_id: organizationId,
        }, this.auth);

        return result;
    }

    async getScheduleToken (organizationId: string, scheduleId: string): Promise<ScheduleLiveTokenResponse> {
        const url = `${this.endpoint}/v1/schedules/${scheduleId}/live/token`;
        const result = await fetchJsonData<ScheduleLiveTokenResponse>(url, `GET`, {
            org_id: organizationId,
            schedule_id: scheduleId,
            live_token_type: ScheduleLiveTokenType.LIVE,
        }, this.auth);

        return result;
    }

    async getScheduleFeedbacks (organizationId: string, scheduleId: string, userId: string): Promise<ScheduleFeedbackResponse[]> {
        const url = `${this.endpoint}/v1/schedules_feedbacks`;
        const result = await fetchJsonData<ScheduleFeedbackResponse[]>(url, `GET`, {
            org_id: organizationId,
            schedule_id: scheduleId,
            user_id: userId,
        }, this.auth);

        return result;
    }

    async postScheduleFeedback (organizationId: string, scheduleId: string, comment: string, assignments: Assignment[]): Promise<PostScheduleFeedbackResponse> {
        const url = `${this.endpoint}/v1/schedules_feedbacks?org_id=${organizationId}`;
        const result = await fetchJsonData<PostScheduleFeedbackResponse>(url, `POST`, {
            schedule_id: scheduleId,
            assignments: assignments,
            comment: comment,
        }, this.auth);

        return result;
    }

    async getNewestFeedback (organizationId: string, scheduleId: string, userId: string): Promise<ScheduleFeedbackResponse> {
        const url = `${this.endpoint}/v1/schedules/${scheduleId}/operator/newest_feedback`;
        const result = await fetchJsonData<ScheduleFeedbackResponse>(url, `GET`, {
            org_id: organizationId,
            schedule_id: scheduleId,
            user_id: userId,
        }, this.auth);

        return result;
    }
}
