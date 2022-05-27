import { fromSecondsToMilliseconds } from "@/utils/utils";
import { isSameDay } from "date-fns";
import { random } from "lodash";
import { GetLearningOutComesResponse, ReportAssignment, ReportLiveClass } from "@kl-engineering/cms-api-client";

export enum ReportType {
    PARENT_DASHBOARD,
    LIVE_CLASS,
    STUDY_ASSESSMENTS,
    LEARNING_OUTCOMES,
}

export interface DataFilterByDates{
    data: (GetLearningOutComesResponse | ReportLiveClass | ReportAssignment)[];
    date: number | string;
}

export enum LearningOutcomeStatus {
    ACHIEVED = `achieved`,
    NOT_ACHIEVED = `not_achieved`,
    IN_PROGRESS = `partially`
}

export interface AchivementStatus {
    achieved: number;
    total: number;
}

export function filterDataWithDates (dataWithDates: DataFilterByDates[], compareDate: number, newData: GetLearningOutComesResponse[]) {
    let isHasSameday = false;
    const newMap: DataFilterByDates[] = dataWithDates.map((item: DataFilterByDates) => {
        if(isSameDay(fromSecondsToMilliseconds((item.date) as number), fromSecondsToMilliseconds(compareDate))){
            isHasSameday = true;
            return {
                ...item,
                data: [ ...item.data, ...newData ],
            };
        }
        return item;
    });
    if(!isHasSameday){
        newMap.push({
            date: compareDate,
            data: newData,
        });
    }
    return newMap;
}

export function getRandomReportType () {
    const randomInt: number = random(Object.values(ReportType).length - 1);
    switch(randomInt){
    case 0:
        return ReportType.PARENT_DASHBOARD;
    case 1:
        return ReportType.LIVE_CLASS;
    case 2:
        return ReportType.STUDY_ASSESSMENTS;
    case 3:
        return ReportType.LEARNING_OUTCOMES;
    default:
        return ReportType.LEARNING_OUTCOMES;
    }
}
