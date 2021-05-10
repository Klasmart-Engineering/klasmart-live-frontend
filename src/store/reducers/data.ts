import { createSlice } from "@reduxjs/toolkit";
import { LessonMaterial } from "../../lessonMaterialContext";
import { ScheduleTimeViewResponse, ScheduleResponse } from "../../services/cms/ISchedulerService";

type DataState = {
    scheduleTimeViewAll: ScheduleTimeViewResponse[],
    scheduleTimeViewLiveAll: ScheduleTimeViewResponse[],
    scheduleTimeViewLiveToday: ScheduleTimeViewResponse[],
    scheduleTimeViewLiveTomorrow: ScheduleTimeViewResponse[],
    scheduleTimeViewLiveUpcoming: ScheduleTimeViewResponse[],
    scheduleTimeViewStudyAll: ScheduleTimeViewResponse[],
    scheduleTimeViewStudyAnytime: ScheduleTimeViewResponse[],
    scheduleStudyAnytime: ScheduleResponse[],
    scheduleStudyDueDate: ScheduleResponse[],
    lessonPlanIdOfSelectedSchedule: string,
    materials: LessonMaterial[],
}

const initialDataState: DataState = {
    scheduleTimeViewAll: [],
    scheduleTimeViewLiveAll: [],
    scheduleTimeViewLiveToday: [],
    scheduleTimeViewLiveTomorrow: [],
    scheduleTimeViewLiveUpcoming: [],
    scheduleTimeViewStudyAll: [],
    scheduleTimeViewStudyAnytime: [],
    scheduleStudyAnytime: [],
    scheduleStudyDueDate: [],
    lessonPlanIdOfSelectedSchedule: "",
    materials: []
}

const dataSlice = createSlice({
    name: "data",
    initialState: initialDataState,
    reducers: {
        setScheduleTimeViewAll(state, action) {
            return { ...state, scheduleTimeViewAll: action.payload }
        },
        setScheduleTimeViewLiveAll(state, action) {
            return { ...state, scheduleTimeViewLiveAll: action.payload }
        },
        setScheduleTimeViewLiveToday(state, action) {
            return { ...state, scheduleTimeViewLiveToday: action.payload }
        },
        setScheduleTimeViewLiveTomorrow(state, action) {
            return { ...state, scheduleTimeViewLiveTomorrow: action.payload }
        },
        setScheduleTimeViewLiveUpcoming(state, action) {
            return { ...state, scheduleTimeViewLiveUpcoming: action.payload }
        },
        setScheduleTimeViewStudyAll(state, action) {
            return { ...state, scheduleTimeViewStudyAll: action.payload }
        },
        setScheduleTimeViewStudyAnytime(state, action) {
            return { ...state, scheduleTimeViewStudyAnytime: action.payload }
        },
        setScheduleStudyAnytime(state, action) {
            return { ...state, scheduleStudyAnytime: action.payload }
        },
        setScheduleStudyDueDate(state, action) {
            return { ...state, scheduleStudyDueDate: action.payload }
        },
        setLessonPlanIdOfSelectedSchedule(state, action) {
            return { ...state, lessonPlanIdOfSelectedSchedule: action.payload }
        },
        setMaterials(state, action) {
            return { ...state, materials: action.payload }
        },
    }
})

export const {
    setScheduleTimeViewAll,
    setScheduleTimeViewLiveAll,
    setScheduleTimeViewLiveToday,
    setScheduleTimeViewLiveTomorrow,
    setScheduleTimeViewLiveUpcoming,
    setScheduleTimeViewStudyAll,
    setScheduleTimeViewStudyAnytime,
    setScheduleStudyAnytime,
    setScheduleStudyDueDate,
    setLessonPlanIdOfSelectedSchedule,
    setMaterials,
} = dataSlice.actions

export default dataSlice.reducer