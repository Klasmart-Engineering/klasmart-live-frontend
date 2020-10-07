/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAccountEndpoint, getAuthEndpoint, getOrganizationEndpoint, getPaymentEndpoint, getProductEndpoint, getRegionEndpoint } from "../config";
import { IdentityType } from "../utils/accountType";
import { RestAPIError, RestAPIErrorType } from "./restapi_errors";
import { getAssessmentEndpoint, isDevStage } from "../config";

// import { useStore } from "react-redux";
// import { ActionTypes } from "../store/actions";
// import { Store } from "../store/store";
function phoneOrEmail(str: string): { phoneNr?: string, email?: string } {
    if (str.indexOf("@") === -1) {
        return { phoneNr: str };
    } else {
        return { email: str };
    }
}

export class RestAPI {

    private store: Store;

    constructor(store: ReturnType<typeof useStore>) {
        this.store = store as any; // TODO: Fix types
    }

    public async signup(id: string, pw: string, lang: string) {
        const { phoneNr, email } = phoneOrEmail(id);
        const result = await this.accountCall("POST", "v1/signup", JSON.stringify({
            email,
            lang,
            phoneNr,
            pw,
        }));
        if (result.status !== 200) { return false; }
        const body = await result.json();
        this.store.dispatch({ type: ActionTypes.SIGNUP, payload: body });
        return;
    }

    public verify(verificationCode: string, type: IdentityType) {
        const state = this.store.getState();
        const accountId = state.account.accountId;
        if (accountId === null) { throw new Error("Unknown AccountID"); }
        switch (type) {
        case IdentityType.Phone:
            return this.accountCall("POST", "v1/verify/phonenumber", JSON.stringify({ accountId, verificationCode }));
        case IdentityType.Email:
            return this.accountCall("POST", "v1/verify/email", JSON.stringify({ accountId, verificationCode }));
        default:
            throw new Error("Unknown Account Type");
        }
    }

    public async verifyCheck(type: IdentityType) {
        const state = this.store.getState();
        const accountId = state.account.accountId;
        if (accountId === null) { throw new Error("Unknown AccountID"); }
        const params = new URLSearchParams({ accountId }).toString();
        let url: string;
        switch (type) {
        case IdentityType.Phone:
            url = "v1/verify/phonenumber";
            break;
        case IdentityType.Email:
            url = "v1/verify/email";
            break;
        default:
            throw new Error("Unknown Account Type");
        }
        const response = await this.accountCall("GET", `${url}?${params}`);
        const body = await response.json();
        if (typeof body === "object" && typeof body.verified === "boolean") {
            return body.verified;
        }
        throw new RestAPIError(RestAPIErrorType.UNKNOWN, body);
    }

    public forgotPassword(id: string, lang: string) {
        const { phoneNr, email } = phoneOrEmail(id);
        return this.accountCall("POST", "v1/forgotpassword", JSON.stringify({
            email,
            lang,
            phoneNr,
        }));
    }

    public restorePassword(id: string, password: string, resetCode: string) {
        const { phoneNr, email } = phoneOrEmail(id);

        return this.accountCall("POST", "v1/restorepassword", JSON.stringify({
            accountEmail: email,
            accountPhoneNr: phoneNr,
            pw: password,
            verificationCode: resetCode,
        }));
    }

    public changePassword(currentPassword: string, newPassword: string) {
        return this.accountCall("POST", "v1/self/password", JSON.stringify({
            currPass: currentPassword,
            newPass: newPassword,
        }));
    }

    public async refreshSession() {
        // TODO: Create promise that other api calls can wait on for refresh
        const state = this.store.getState();
        const deviceId = await this.deviceId();
        if (typeof state.account.sessionId !== "string") {
            throw new Error("Could not refresh session - session not started");
        }
        if (typeof state.account.refreshToken !== "string") {
            throw new Error("Could not refresh session - no refresh token");
        }
        if (typeof state.account.accountId !== "string") {
            throw new Error("Could not refresh session - 'accountId' is missing");
        }
        if (typeof deviceId !== "string") {
            throw new Error("Could not refresh session - 'deviceId' is missing");
        }
        if (typeof state.account.refreshTokenExpire === "number" && state.account.refreshTokenExpire < Date.now()) {
            console.log("It seems that the refresh token has expired, attempting to refresh session regardless.");
        }
        const response = await this.authCall("v1/token", JSON.stringify({
            accountId: state.account.accountId,
            deviceId,
            refreshToken: state.account.refreshToken,
            sessionId: state.account.sessionId,
        }), false);
        if (response.status !== 200) {
            return false;
        }
        const body = await response.json();
        this.store.dispatch({ type: ActionTypes.REFRESH_SESSION, payload: body });
        return true;
    }
    public async endSession(): Promise<undefined> {
        const state = this.store.getState();
        const deviceId = state.account.deviceId;
        try {
            await this.authCall("v1/signout", JSON.stringify({ deviceId }));
        } catch (e) {
            if (!(e instanceof RestAPIError)) { throw e; }
            switch (e.getErrorMessageType()) {
            case RestAPIErrorType.ITEM_NOT_FOUND:
            case RestAPIErrorType.DEVICE_NOT_FOUND:
                break;
            default:
                throw e;
            }
        } finally {
            // Destroy local session data even if server wouldn't
            this.store.dispatch({ type: ActionTypes.LOGOUT, payload: undefined });
        }
        return;
    }
    private async autoRefreshSesion() {
        try {
            await this.refreshSession();
            // TODO: implement retry
        } catch (e) {
            console.log("failed to autorefresh session");
        }
    }

    private paymentCall(method: "POST" | "GET" | "DELETE", route: string, body?: string, refresh = true) {
        return this.call(method, getPaymentEndpoint(), route, body, refresh);
    }
    private productCall(method: "GET" | "POST", route: string, body?: string, refresh = true) {
        return this.call(method, getProductEndpoint(), route, body, refresh);
    }
    private authCall(route: string, body: string, refresh = true) {
        return this.call("POST", getAuthEndpoint(), route, body, refresh);
    }
    private accountCall(method: "GET" | "POST", route: string, body?: string, refresh = true) {
        return this.call(method, getAccountEndpoint(), route, body, refresh);
    }
    private organizationCall(method: "GET" | "POST", route: string, region: string, body?: string, refresh = true) {
        return this.call(method, getOrganizationEndpoint(region), route, body, refresh);
    }
    private regionCall(method: "GET", route: string, body?: string, refresh = true) {
        return this.call(method, getRegionEndpoint(), route, body, refresh);
    }

    private async call(method: string, prefix: string, route: string, body: string | undefined, refresh: boolean) {
        try {
            const response = await this.fetchRoute(method, prefix, route, body);
            return response;
        } catch (e) {
            if (e instanceof RestAPIError) {
                switch (e.getErrorMessageType()) {
                case RestAPIErrorType.EXPIRED_ACCESS_TOKEN:
                    this.store.dispatch({ type: ActionTypes.EXPIRED_ACCESS_TOKEN });
                    if (refresh) {
                        await this.refreshSession();
                        return this.fetchRoute(method, prefix, route, body);
                    }
                    break;
                case RestAPIErrorType.EXPIRED_REFRESH_TOKEN:
                    this.store.dispatch({ type: ActionTypes.EXPIRED_REFRESH_TOKEN });
                    break;
                }
            }
            throw e;
        }
    }

    private async fetchRoute(method: string, prefix: string, route: string, body?: string) {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        const state = this.store.getState();
        if (typeof state.account.assessmentToken === "string") {
            headers.append("authorization", state.account.assessmentToken);
        } else if (typeof state.account.accessToken === "string") {
            headers.append("Authorization", `Bearer ${state.account.accessToken}`);
            if (typeof state.account.accessTokenExpire === "number" && state.account.accessTokenExpire < Date.now()) {
                console.log("It seems like the access token has expired, attempting request regardless");
            }
        }
        // const url = prefix + route;
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

    private async deviceId() {
        const state = this.store.getState();
        if (state.account.deviceId !== null) {
            return state.account.deviceId;
        }
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<string>(async (resolve) => {
            let deviceId = "";
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < 64; i++) {
                deviceId += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            this.store.dispatch({ type: ActionTypes.DEVICE_ID, payload: deviceId });
            resolve(deviceId);
        });
    }

    // Assessments
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
        console.log("assInfo", assInfo);
        console.log("JSON.stringify(assInfo)", JSON.stringify(assInfo));
        const result = await this.assessmentCall("POST", "v1/assessment/" + assId, JSON.stringify({
            "students": mapToObj(assInfo.students)
        }));
        const body = await result.json();
        return body;
    }

}

const mapToObj = (m: any) => {
    return Array.from(m).reduce((obj: any, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});
};

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
    externalId?: string;
    externalType?: number;
    devSkillId: string;
    skillCatId: string;
    publicRange: number;
    suitableAge: number;
    description: string;
    learningOutcomes?: Array<number>;
}

export class CreateLessonMaterialRequest extends BaseCreate {
    type: number;
    externalId?: string;
    externalType?: number;
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
    externalId?: string;
    externalType?: number;
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
    externalId?: string;
    externalType?: number;
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
    externalId?: string;
    externalType?: number;
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
    externalId?: string;
    externalType?: number;
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

export function useRestAPI() {
    const store = useStore();
    const api = new RestAPI(store);
    (window as any).api = api;
    return api;
}
