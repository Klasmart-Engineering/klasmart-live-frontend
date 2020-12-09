
import { ScheduleDetail } from "../../store/reducers/data";
import { fetchJsonData } from "../../utils/requestUtils";
import { IAuthenticationService } from "../auth/IAuthenticationService";
import { ISchedulerService, ScheduleLiveTokenResponse, ScheduleTimeViewResponse, TimeView } from "./ISchedulerService";

/**
 * Client side API implementation for: https://swagger-ui.kidsloop.net/#/schedule
 */
export class SchedulerService implements ISchedulerService {
    private endpoint: string;
    private auth: IAuthenticationService;

    constructor(endpoint: string, auth: IAuthenticationService) {
        this.endpoint = endpoint;
        this.auth = auth;
    }

    async getScheduleTimeViews(organizationId: string, viewType: TimeView, timeAt: number, timeZoneOffset: number): Promise<ScheduleTimeViewResponse[]> {
        const url = `${this.endpoint}/v1/schedules_time_view`;
        const results = await fetchJsonData<ScheduleTimeViewResponse[]>(url, "GET", {
            view_type: viewType,
            time_at: timeAt,
            time_zone_offset: timeZoneOffset,
            org_id: organizationId
        }, this.auth);

        return results;
    }

    async getScheduleInfo(organizationId: string, scheduleId: string): Promise<ScheduleDetail> {
        const url = `${this.endpoint}/v1/schedules/${scheduleId}`;
        const result = await fetchJsonData<ScheduleDetail>(url, "GET", {
            org_id: organizationId
        }, this.auth);

        return result;
    }

    async getScheduleLiveToken(organizationId: string, scheduleId: string): Promise<ScheduleLiveTokenResponse> {
        const url = `${this.endpoint}/v1/schedules/${scheduleId}/live/token`;
        const result = await fetchJsonData<ScheduleLiveTokenResponse>(url, "GET", {
            org_id: organizationId
        }, this.auth);

        return result;
    }
}
