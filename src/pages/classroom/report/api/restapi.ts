import { useStore } from "react-redux";
import { RestAPIError, RestAPIErrorType } from "../../../../api/restapi_errors";
import { Store } from "../../../../store/store";
import { getAssessmentEndpoint, isDevStage } from "../../../../config";

export function useRestAPI() {
    const store = useStore();
    const api = new RestAPI(store);
    (window as any).api = api;
    return api;
}

export class RestAPI {

    private store: Store;

    constructor(store: ReturnType<typeof useStore>) {
        this.store = store as any; // TODO: Fix types
    }

    private async fetchRoute(method: string, prefix: string, route: string, body?: string) {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const state = this.store.getState();

        if (typeof state.account.assessmentToken === "string") {
            headers.append("authorization", state.account.assessmentToken);
        }

        const url = (isDevStage() ? "" : prefix) + route;
        const response = await fetch(url, {
            body,
            // credentials: "include",
            headers,
            method,
        });

        if (response.status === 200) { return response; }

        const responseBody = await response.json();
        let errCode = RestAPIErrorType.UNKNOWN;
        let errParams;
        if (typeof responseBody.errCode === "number") {
            errCode = responseBody.errCode;
        }
        if (typeof responseBody.errParams === "object") {
            errParams = responseBody.errParams;
        }
        throw new RestAPIError(errCode, errParams);

    }

    private async call(method: string, prefix: string, route: string, body: string | undefined, refresh: boolean) {
        try {
            const response = await this.fetchRoute(method, prefix, route, body);
            return response;
        } catch (e) {
            throw e;
        }
    }

    private assessmentCall(method: "GET" | "POST" | "PUT" | "DELETE", route: string, body?: string, refresh = true) {
        return this.call(method, getAssessmentEndpoint(), route, body, refresh);
    }

    // Report

    public async getLearningOutcomes(): Promise<LearningOutcomeListResponse> {
        const result = await this.assessmentCall("GET", "v1/learningOutcome");
        const body = await result.json();
        return body;
    }

    public async getDevSkills(): Promise<DevSkillListResponse> {
        const result = await this.assessmentCall("GET", "v1/devSkill");
        const body = await result.json();
        return body;
    }

    public async getAssessments(): Promise<AssessmentListResponse> {
        const result = await this.assessmentCall("GET", "v1/assessment");
        const body = await result.json();
        return body;
    }

    public async getReportLearningOutcomeList(reportInfo: ReportLearningOutcomeRequest): Promise<ReportLearningOutcomeListResponse> {
        const result = await this.assessmentCall("POST", "v1/report/list", JSON.stringify(reportInfo));
        const body = await result.json();
        return body;
    }

    public async getReportLearningOutcomeClass(reportInfo: ReportLearningOutcomeRequest): Promise<ReportLearningOutcomeListResponse> {
        const result = await this.assessmentCall("POST", "v1/report/class", JSON.stringify(reportInfo));
        const body = await result.json();
        return body;
    }

}

// ---------------- Models ----------------

class BaseCreate {
    publish: boolean;
}

class BaseUpdate {
    publish?: boolean;
}

class BaseInfo {
    issuerId: string;
    orgId: string;
    published: boolean;
    createdDate: number;
    updatedDate: number;
}

// Data report

export class ReportLearningOutcomeRequest {
    profileId: string;
    programId: string;
    classId: string;
}

export class ReportLearningOutcomeListResponse {
    learningOutcomes: Array<ReportLearningOutcomeResponse>;
}

export class ReportLearningOutcomeResponse {
    id: number;
    status: number;
}

export class LearningOutcomeListResponse {
    learningOutcomes: Array<LearningOutcomeResponse>;
}

export class LearningOutcomeResponse extends BaseInfo {
    loId: number;
    accountId: string;
    title: string;
    progId: string;
    devSkillId: string;
    skillCatId: string;
    assumed: boolean;
    description: string;
    estimatedDuration?: number;
    tags: Array<string>;
}

export class DevSkillListResponse {
    devSkills: Array<DevSkillResponse>;
}

export class DevSkillResponse extends BaseInfo {
    devSkillId: string;
    name: string;
}

export class AssessmentListResponse {
    assessments: Array<AssessmentResponse>;
}

export class AssessmentResponse extends BaseInfo {
    assId: string;
    progId: string;
    classId: string;
    lessonPlanId: string;
    sessionId: string;
    name: string;
    duration: number;
    assessedDate: number;
    subject: string;
    students: Array<AssessmentStudentResponse>;
    published: boolean;
    lessonMaterials?: Array<LessonMaterialResponse>;
    learningOutcomes?: Array<AssessmentLearningOutcomeResponse>;
    state: number;
}

export class AssessmentStudentResponse {
    profileId: string;
    profileName: string;
    iconLink: string;
}

export class AssessmentLearningOutcomeResponse {
    loId: number;
    assessedStudents: Array<string>;
    assumed: boolean;
}

export class LessonMaterialResponse extends BaseInfo {
    lessonMaterialId: string;
    type: number;
    name: string;
    externalId?: string;
    externalType?: number;
    devSkillId: string;
    skillCatId: string;
    publicRange: number;
    suitableAge: number;
    description: string;
    learningOutcomes?: Array<number>;
}