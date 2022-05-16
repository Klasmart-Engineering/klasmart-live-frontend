import { LearningOutComes } from "@/app/context-provider/parent-context";
import { formatMonthDateYear } from "@/app/utils/dateTimeUtils";
import {
    GetAssignmentsItem,
    getLearningOutcomes,
    GetLearningOutComesResponse,
    GetLiveClassesItem,
} from "@kl-engineering/cms-api-client/dist/api/report";
import { AxiosInstance } from "axios";
import { IntlShape } from "react-intl";
import { ButtonType, LearningOutcomeCount } from "./list/ListItem";

export const learningOutcomesDataFunc = async (assessmentId: string, organization: string, axiosClient: AxiosInstance, studentId: string) => {
    const dataClasses = await getLearningOutcomes(axiosClient, {
        org_id: organization,
        assessment_id: assessmentId,
        student_id: studentId ?? ``,
    });
    return dataClasses;
};

export const assesmentLearning = (arrAssessClasses: [GetAssignmentsItem], axiosClient: AxiosInstance, organization: string, studentId: string) => {
    const learningOutComesData: LearningOutComes = {};
    return Promise.all(arrAssessClasses.map(async item => {
        const learningData = await getLearningOutComes(item.assessment_id, item.create_at.toString(), organization, learningOutComesData, axiosClient, studentId);
        return Promise.resolve(learningData);
    }));
};

export const liveClassesLearning = (arrliveClasses: [GetLiveClassesItem], axiosClient: AxiosInstance, organization: string, studentId: string) => {
    const learningOutComesData: LearningOutComes = {};
    return Promise.all(arrliveClasses.map(async item => {
        const learningData = await getLearningOutComes(item.assessment_id, item.class_start_time.toString(), organization, learningOutComesData, axiosClient, studentId);
        return Promise.resolve(learningData);
    }));

};

export const getLearningOutComes = async (assessmentId: string, time: string, organization: string, learningOutComesData: LearningOutComes, axiosClient: AxiosInstance, studentId: string) => {
    const learningData = await learningOutcomesDataFunc(assessmentId, organization, axiosClient, studentId);
    const listLearning = updateLearningOuComes(time, learningData, learningOutComesData);
    return listLearning;
};

export const updateLearningOuComes = (key: string, value: [GetLearningOutComesResponse], learningOutComesData: LearningOutComes) => {
    let items = learningOutComesData[key];
    if (items) {
        items = [ ...items, ...value ];
    } else {
        items = value;
    }
    learningOutComesData[key] = items;
    return learningOutComesData;
};

export  const getStatusLearningOutComes = (listData?: LearningOutComes[]) => {
        const objLearning = listData && listData[0] as LearningOutComes | {} as LearningOutComes ;
        let achieved = 0;
        let total = 0;
        objLearning && Object.keys(objLearning).forEach((key) => {
            objLearning[key].forEach(element => {
                if (element.status === ButtonType.ACHIVED) {
                    achieved++;
                }
                total++;
            });
        });
    return updateStatus(total, achieved);
};

export const updateStatus = (total: number, achieved: number) => {
        const percent = total === 0 ? 0 : achieved / total * 100;
        const achievedValue = `${achieved}/${total}`;
        const learning: LearningOutcomeCount = {
            achieved: achievedValue,
            percent: percent,
            total: total
        };
        return learning;
}

export const getDataLearning = (learningOutComes: LearningOutComes[], intl: IntlShape) => {
        
        let dataLearningTemp: LearningOutComes = {};
        learningOutComes.forEach(element => {
            Object.keys(element).forEach(key => {
                if (element[key].length > 0) {
                    const date = formatMonthDateYear(parseInt(key) * 1000, intl);
                    let items = dataLearningTemp[date];
                    if (items) {
                        items = [ ...items, ...element[key]];
                    } else {
                        items = element[key];
                    }
                    dataLearningTemp[date] = items;
                }
            });
        });
        return dataLearningTemp;
}