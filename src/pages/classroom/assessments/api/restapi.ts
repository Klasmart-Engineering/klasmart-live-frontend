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


    // Lesson Material

    public async getLessonMaterials(): Promise<LessonMaterialListResponse> {
        const result = await this.assessmentCall("GET", "v1/lessonMaterial");
        const body = await result.json();
        return body;
    }

    public async getLessonMaterial(lessonMaterialId: string): Promise<LessonMaterialResponse> {
        const result = await this.assessmentCall("GET", "v1/lessonMaterial/" + lessonMaterialId);
        const body = await result.json();
        return body;
    }

    public async createLessonMaterial(lessonMaterialInfo: CreateLessonMaterialRequest): Promise<CreateLessonMaterialResponse> {
        const result = await this.assessmentCall("POST", "v1/lessonMaterial", JSON.stringify(lessonMaterialInfo));
        const body = await result.json();
        return body;
    }

    public async updateLessonMaterial(lessonMaterialId: string, lessonMaterialInfo: UpdateLessonMaterialRequest) {
        const result = await this.assessmentCall("PUT", "v1/lessonMaterial/" + lessonMaterialId, JSON.stringify(lessonMaterialInfo));
        const body = await result.json();
        return body;
    }

    public async deleteLessonMaterial(lessonMaterialId: string) {
        const result = await this.assessmentCall("DELETE", "v1/lessonMaterial/" + lessonMaterialId);
        const body = await result.json();
        return body;
    }

    public async getLessonMaterialIcon(lessonMaterialId: string) {
        const result = await this.assessmentCall("GET", "v1/lessonMaterial/" + lessonMaterialId + "/icon");
        // TODO
    }

    public async createLessonMaterialIcon(lessonMaterialId: string, lessonMaterialInfo: CreateLessonMaterialIconRequest): Promise<CreateLessonMaterialIconResponse> {
        const result = await this.assessmentCall("POST", "v1/lessonMaterial/" + lessonMaterialId + "/icon", JSON.stringify(lessonMaterialInfo));
        const body = await result.json();
        return body;
    }


    // Lesson Plan

    public async getLessonPlans(): Promise<LessonPlanListResponse> {
        const result = await this.assessmentCall("GET", "v1/lessonPlan");
        const body = await result.json();
        return body;
    }

    public async getLessonPlan(lessonPlanId: string): Promise<LessonPlanResponse> {
        const result = await this.assessmentCall("GET", "v1/lessonPlan/" + lessonPlanId);
        const body = await result.json();
        return body;
    }

    public async createLessonPlan(lessonPlanInfo: CreateLessonPlanRequest): Promise<CreateLessonPlanResponse> {
        const result = await this.assessmentCall("POST", "v1/lessonPlan", JSON.stringify(lessonPlanInfo));
        const body = await result.json();
        return body;
    }

    public async updateLessonPlan(lessonPlanId: string, lessonPlanInfo: UpdateLessonPlanRequest) {
        const result = await this.assessmentCall("PUT", "v1/lessonPlan/" + lessonPlanId, JSON.stringify(lessonPlanInfo));
        const body = await result.json();
        return body;
    }

    public async deleteLessonPlan(lessonPlanId: string) {
        const result = await this.assessmentCall("DELETE", "v1/lessonPlan/" + lessonPlanId);
        const body = await result.json();
        return body;
    }

    public async getLessonPlanIcon(lessonPlanId: string) {
        const result = await this.assessmentCall("GET", "v1/lessonPlan/" + lessonPlanId + "/icon");
        // TODO
    }

    public async createLessonPlanIcon(lessonPlanId: string, lessonPlanInfo: CreateLessonPlanIconRequest): Promise<CreateLessonPlanIconResponse> {
        const result = await this.assessmentCall("POST", "v1/lessonPlan/" + lessonPlanId + "/icon", JSON.stringify(lessonPlanInfo));
        const body = await result.json();
        return body;
    }

    // Learning Outcome

    public async getLearningOutcomes(): Promise<LearningOutcomeListResponse> {
        const result = await this.assessmentCall("GET", "v1/learningOutcome");
        const body = await result.json();
        return body;
    }

    public async getLearningOutcome(loId: number): Promise<LearningOutcomeResponse> {
        const result = await this.assessmentCall("GET", "v1/learningOutcome/" + loId);
        const body = await result.json();
        return body;
    }

    public async createLearningOutcome(learningOutcomeInfo: CreateLearningOutcomeRequest): Promise<CreateLearningOutcomeResponse> {
        const result = await this.assessmentCall("POST", "v1/learningOutcome", JSON.stringify(learningOutcomeInfo));
        const body = await result.json();
        return body;
    }

    public async updateLearningOutcome(loId: number, learningOutcomeInfo: UpdateLearningOutcomeRequest) {
        const result = await this.assessmentCall("PUT", "v1/learningOutcome/" + loId, JSON.stringify(learningOutcomeInfo));
        const body = await result.json();
        return body;
    }

    public async deleteLearningOutcome(loId: number) {
        const result = await this.assessmentCall("DELETE", "v1/learningOutcome/" + loId);
        const body = await result.json();
        return body;
    }

    // Dev Skill

    public async getDevSkills(): Promise<DevSkillListResponse> {
        const result = await this.assessmentCall("GET", "v1/devSkill");
        const body = await result.json();
        return body;
    }

    public async getDevSkill(devSkillId: string): Promise<DevSkillResponse> {
        const result = await this.assessmentCall("GET", "v1/devSkill/" + devSkillId);
        const body = await result.json();
        return body;
    }

    public async createDevSkill(devSkillInfo: CreateDevSkillRequest): Promise<CreateDevSkillResponse> {
        const result = await this.assessmentCall("POST", "v1/devSkill", JSON.stringify(devSkillInfo));
        const body = await result.json();
        return body;
    }

    public async updateDevSkill(devSkillId: string, devSkillInfo: UpdateDevSkillRequest) {
        const result = await this.assessmentCall("PUT", "v1/devSkill/" + devSkillId, JSON.stringify(devSkillInfo));
        const body = await result.json();
        return body;
    }

    public async deleteDevSkill(devSkillId: string) {
        const result = await this.assessmentCall("DELETE", "v1/devSkill/" + devSkillId);
        const body = await result.json();
        return body;
    }

    // Skill Cat

    public async getSkillCats(): Promise<SkillCatListResponse> {
        const result = await this.assessmentCall("GET", "v1/skillCat");
        const body = await result.json();
        return body;
    }

    public async getSkillCat(skillCatId: string): Promise<SkillCatResponse> {
        const result = await this.assessmentCall("GET", "v1/skillCat/" + skillCatId);
        const body = await result.json();
        return body;
    }

    public async createSkillCat(skillCatInfo: CreateSkillCatRequest): Promise<CreateSkillCatResponse> {
        const result = await this.assessmentCall("POST", "v1/skillCat", JSON.stringify(skillCatInfo));
        const body = await result.json();
        return body;
    }

    public async updateSkillCat(skillCatId: string, skillCatInfo: UpdateSkillCatRequest) {
        const result = await this.assessmentCall("PUT", "v1/skillCat/" + skillCatId, JSON.stringify(skillCatInfo));
        const body = await result.json();
        return body;
    }

    public async deleteSkillCat(skillCatId: string) {
        const result = await this.assessmentCall("DELETE", "v1/skillCat/" + skillCatId);
        const body = await result.json();
        return body;
    }

    // Assessment

    public async getAssessments(): Promise<AssessmentListResponse> {
        const result = await this.assessmentCall("GET", "v1/assessment");
        const body = await result.json();
        return body;
    }

    public async getAssessment(assId: string): Promise<AssessmentResponse> {
        const result = await this.assessmentCall("GET", "v1/assessment/" + assId);
        const body = await result.json();
        return body;
    }

    public async createAssessment(assInfo: CreateAssessmentRequest): Promise<CreateAssessmentResponse> {
        const result = await this.assessmentCall("POST", "v1/assessment", JSON.stringify(assInfo));
        const body = await result.json();
        return body;
    }

    public async updateAssessment(assId: string, assInfo: UpdateAssessmentRequest) {
        const result = await this.assessmentCall("PUT", "v1/assessment/" + assId, JSON.stringify(assInfo));
        const body = await result.json();
        return body;
    }

    public async deleteAssessment(assId: string) {
        const result = await this.assessmentCall("DELETE", "v1/assessment/" + assId);
        const body = await result.json();
        return body;
    }

    public async completeAssessment(assId: string, assInfo: CompleteAssessmentRequest): Promise<CompleteAssessmentResponse> {
        const result = await this.assessmentCall("POST", "v1/assessment/" + assId, JSON.stringify(assInfo));
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

// Lesson Material

export class LessonMaterialListResponse {
    lessonMaterials: Array<LessonMaterialResponse>;
}

export class LessonMaterialResponse extends BaseInfo {
    lessonMaterialId: string;
    type: number;
    name: string;
    devSkillId: string;
    skillCatId: string;
    publicRange: number;
    suitableAge: number;
    description: string;
    learningOutcomes?: Array<number>;
}

export class CreateLessonMaterialRequest extends BaseCreate {
    type: number;
    name: string;
    devSkillId: string;
    skillCatId: string;
    publicRange: number;
    suitableAge: number;
    description: string;
    learningOutcomes: Array<number>;
}

export class CreateLessonMaterialResponse {
    lessonMaterialId: string
}

export class UpdateLessonMaterialRequest extends BaseUpdate {
    type?: number;
    name?: string;
    devSkillId?: string;
    skillCatId?: string;
    publicRange?: number;
    suitableAge?: number;
    description?: string;
    learningOutcomes?: Array<number>;
}

export class CreateLessonMaterialIconRequest {
    length: number
}

export class CreateLessonMaterialIconResponse {
    url: string
}

// Lesson Plan

export class LessonPlanListResponse {
    lessonPlans: Array<LessonPlanResponse>;
}

export class LessonPlanResponse extends BaseInfo {
    lessonPlanId: string;
    name: string;
    devSkillId: string;
    skillCatId: string;
    publicRange: number;
    suitableAge: number;
    description: string;
    lessonMaterials?: Array<LessonMaterialLessonPlanResponse>;
    learningOutcomes?: Array<number>;
}

export class LessonMaterialLessonPlanResponse {
    title: string;
    description: string;
    lessonMaterialId: string;
    duration: number;
}

export class CreateLessonPlanRequest extends BaseCreate {
    name: string;
    devSkillId: string;
    skillCatId: string;
    publicRange: number;
    suitableAge: number;
    description: string;
    details: Array<CreateLessonMaterialLessonPlanRequest>;
    learningOutcomes: Array<number>;
}

export class CreateLessonMaterialLessonPlanRequest {
    title: string;
    description: string;
    lessonMaterialId: string;
    duration: number;
}

export class CreateLessonPlanResponse {
    lessonPlanId: string
}

export class UpdateLessonPlanRequest extends BaseUpdate {
    name?: string;
    devSkillId?: string;
    skillCatId?: string;
    publicRange?: number;
    suitableAge?: number;
    description?: string;
    details?: Array<UpdateLessonMaterialLessonPlanRequest>;
    learningOutcomes?: Array<number>;
}

export class UpdateLessonMaterialLessonPlanRequest {
    title: string;
    description: string;
    lessonMaterialId: string;
    duration: number;
}

export class CreateLessonPlanIconRequest {
    length: number
}

export class CreateLessonPlanIconResponse {
    url: string
}

// Learning Outcome

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

export class CreateLearningOutcomeRequest extends BaseCreate {
    title: string;
    progId: string;
    devSkillId: string;
    skillCatId: string;
    assumed: boolean;
    description: string;
    estimatedDuration?: number;
    tags: Array<string>;
}

export class CreateLearningOutcomeResponse {
    loId: number
}

export class UpdateLearningOutcomeRequest extends BaseUpdate {
    title?: string;
    progId?: string;
    devSkillId?: string;
    skillCatId?: string;
    assumed?: boolean;
    description?: string;
    estimatedDuration?: number;
    tags?: Array<string>;
}

// Dev Skill

export class DevSkillListResponse {
    devSkills: Array<DevSkillResponse>;
}

export class DevSkillResponse extends BaseInfo {
    devSkillId: string;
    name: string;
}

export class CreateDevSkillRequest extends BaseCreate {
    name: string;
}

export class CreateDevSkillResponse {
    devSkillId: string;
}

export class UpdateDevSkillRequest extends BaseUpdate {
    name?: string;
}

// Skill Cat

export class SkillCatListResponse {
    skillCats: Array<SkillCatResponse>;
}

export class SkillCatResponse extends BaseInfo {
    skillCatId: string;
    devSkillId: string;
    name: string;
}

export class CreateSkillCatRequest extends BaseCreate {
    name: string;
}

export class CreateSkillCatResponse {
    skillCatId: string;
}

export class UpdateSkillCatRequest extends BaseUpdate {
    devSkillId?: string;
    name?: string;
}

// Assessment

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

export class CreateAssessmentRequest extends BaseCreate {
    progId: string;
    classId: string;
    className: string;
    lessonPlanId: string;
    sessionId: string;
    startDate: number;
    subject: string;
}

export class CreateAssessmentResponse {
    assId: string;
}

export class UpdateAssessmentRequest extends BaseUpdate {
    sessionId?: string;
    awardedStudents?: Array<UpdateAssessmentAwardedStudentRequest>;
    students?: Array<UpdateAssessmentStudentRequest>;
    publish?: boolean;
    state?: number;
}

export class UpdateAssessmentAwardedStudentRequest {
    profileId: string;
    loId: number;
}

export class UpdateAssessmentStudentRequest {
    profileId: string;
    profileName: string;
    iconLink: string;
}

export class CompleteAssessmentRequest {
    sessionId: string;
    students: Map<string, CompleteAssessmentStudentsResquest>;
    date: number;
}

export class CompleteAssessmentStudentsResquest {
    successOutcomes: Array<number>;
    failureOutcomes: Array<number>;
}

export class CompleteAssessmentResponse {
    sessionId: string;
}