import qs from "qs";
import { ISchedulerService, TimeView } from "./ISchedulerService";

function fetchJsonData(url: string, method: string): Promise<Response> {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    const init = {
        headers,
        method
    };

    return fetch(url, init);
}

export type ScheduleTimeView = {
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

export class SchedulerService implements ISchedulerService {
    private endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    async getScheduleTimeViews(organizationId: string, viewType: TimeView, timeAt: number, timeZoneOffset: number): Promise<ScheduleTimeView[]> {
        const parameters = qs.stringify({
            view_type: viewType,
            time_at: timeAt,
            time_zone_offset: timeZoneOffset,
            org_id: organizationId
        }, { encodeValuesOnly: true });

        const url = `${this.endpoint}/v1/schedules_time_view?${parameters}`;
        const response = await fetchJsonData(url, "GET");
 
        if (response.status === 401) {
            // TODO (Axel): Try refreshing token if authentication error.
            return [];
        }

        return await response.json();
    }
}
