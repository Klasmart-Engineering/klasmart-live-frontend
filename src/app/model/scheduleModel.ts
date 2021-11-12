import { ClassType } from "../../store/actions";
import {
    ScheduleResponse,
    ScheduleTimeViewResponse,
} from "../services/cms/ISchedulerService";
import { atom } from "recoil";

export const scheduleState = atom({
    key: `schedule`,
    default: {
        viewClassType: ClassType.LIVE,
        scheduleTimeViewAll: [] as ScheduleTimeViewResponse[],
        scheduleTimeViewLiveAll: [] as ScheduleTimeViewResponse[],
        scheduleTimeViewLiveToday: [] as ScheduleTimeViewResponse[],
        scheduleTimeViewLiveTomorrow: [] as ScheduleTimeViewResponse[],
        scheduleTimeViewLiveUpcoming: [] as ScheduleTimeViewResponse[],
        scheduleTimeViewStudyAll: [] as ScheduleTimeViewResponse[],
        scheduleTimeViewStudyAnytime: [] as ScheduleTimeViewResponse[],
        scheduleStudyAnytime: [] as ScheduleResponse[],
        scheduleStudyDueDate: [] as ScheduleResponse[],
        lessonPlanIdOfSelectedSchedule: ``,
    },
});