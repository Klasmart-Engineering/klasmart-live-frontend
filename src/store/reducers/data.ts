import { createSlice } from "@reduxjs/toolkit";
import { LessonMaterial } from "../../lessonMaterialContext";

type ScheduleStatus = "NotStart" | "Started" | "Closed";
type ScheduleTimeView<D> = {
    id: string;
    title: string;
    start_at: number;
    end_at: number;
    is_repeat: boolean;
    lesson_plan_id: string;
    class_type: boolean;
    status: ScheduleStatus;
    detail?: D
}

export type ForeignIdName = { id: string; name: string }
type RepeatDetail = {
    end: any, // TODO: more detail
    interval?: number,
}
type Repeat = {
    type?: "daily" | "weekly" | "monthly" | "yearly";
    daily: RepeatDetail,
    weekly: RepeatDetail,
    monthly: RepeatDetail,
    yearly: RepeatDetail
}
type ScheduleDetail = {
    attachment: ForeignIdName,
    org_id: string,
    due_at: number,
    description: string,
    version: number,
    is_all_day: boolean,
    repeat: Repeat,
    class: ForeignIdName,
    subject: ForeignIdName,
    program: ForeignIdName,
    teachers: ForeignIdName[],
    lesson_plan: ForeignIdName
}

export type Schedule = ScheduleTimeView<ScheduleDetail>

type DataState = {
    schedule: {
        total: Schedule[],
        live: Schedule[],
        study: Schedule[]
    },
    schedulePage: {
        today: Schedule[],
        tomorrow: Schedule[],
        upcoming: Schedule[]
    },
    selectedLessonPlan: string,
    materials: LessonMaterial[],
}

const initialDataState: DataState = {
    schedule: {
        total: [],
        live: [],
        study: []
    },
    schedulePage: {
        today: [],
        tomorrow: [],
        upcoming: []
    },
    selectedLessonPlan: "",
    materials: []
}

const dataSlice = createSlice({
    name: "data",
    initialState: initialDataState,
    reducers: {
        setSchedule(state, action) {
            return { ...state, schedule: action.payload }
        },
        setSchedulePage(state, action) {
            return { ...state, schedulePage: action.payload }
        },
        setSelectedPlan(state, action) {
            return { ...state, selectedLessonPlan: action.payload }
        },
        setMaterials(state, action) {
            return { ...state, materials: action.payload }
        },
    }
})

export const {
    setSchedule,
    setSchedulePage,
    setSelectedPlan,
    setMaterials,
} = dataSlice.actions

export default dataSlice.reducer