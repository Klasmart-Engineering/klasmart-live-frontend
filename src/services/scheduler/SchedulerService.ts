import qs from "qs";
import { ScheduleDetail } from "../../store/reducers/data";
import { ISchedulerService, ScheduleLiveTokenResponse, ScheduleTimeViewResponse, TimeView } from "./ISchedulerService";

function fetchJsonData(url: string, method: string, parameters?: any): Promise<Response> {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    if (parameters) {
        url = `${url}?${qs.stringify(parameters, { encodeValuesOnly: true })}`;
    }

    const init = {
        headers,
        method
    };

    return fetch(url, init);
}

/**
 * Client side API implementation for: https://swagger-ui.kidsloop.net/#/schedule
 */
export class SchedulerService implements ISchedulerService {
    private endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    async getScheduleTimeViews(organizationId: string, viewType: TimeView, timeAt: number, timeZoneOffset: number): Promise<ScheduleTimeViewResponse[]> {
        const url = `${this.endpoint}/v1/schedules_time_view`;
        const response = await fetchJsonData(url, "GET", {
            view_type: viewType,
            time_at: timeAt,
            time_zone_offset: timeZoneOffset,
            org_id: organizationId
        });

        if (!response.ok) {
            if (response.status === 401) {
                // TODO (Axel): Try refreshing token if authentication error.
            }

            throw new Error(response.statusText);
        }

        return await response.json();
    }

    async getScheduleInfo(orgnaizationId: string, scheduleId: string): Promise<ScheduleDetail> {
        const url = `${this.endpoint}/v1/schedules/${scheduleId}`;
        const response = await fetchJsonData(url, "GET", {
            org_id: orgnaizationId
        });

        if (!response.ok) {
            if (response.status === 401) {
                // TODO (Axel): Try refreshing token if authentication error.
            }

            throw new Error(response.statusText);
        }

        return await response.json();
    }

    async getScheduleLiveToken(organizationId: string, scheduleId: string): Promise<ScheduleLiveTokenResponse> {
        const url = `${this.endpoint}/v1/schedules/${scheduleId}/live/token`;
        const response = await fetchJsonData(url, "GET", {
            org_id: organizationId
        });

        if (!response.ok) {
            if (response.status === 401) {
                // TODO (Axel): Try refreshing token if authentication error.
            }

            throw new Error(response.statusText);
        }
        
        return await response.json();
    }
}
