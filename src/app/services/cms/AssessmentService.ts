import { fetchJsonData } from "../../utils/requestUtils";
import { IAuthenticationService } from "../auth/IAuthenticationService";
import {
    AssessmentForStudent,
    AssessmentsForStudentResponse,
    AssessmentType,
    IAssessmentService,
} from "./IAssessmentService";

export class AssessmentService implements IAssessmentService {
    private endpoint: string;
    private auth: IAuthenticationService;

    constructor (endpoint: string, auth: IAuthenticationService) {
        this.endpoint = endpoint;
        this.auth = auth;
    }

    async getAssessmentsForStudent (organizationId: string, scheduleIDs: string[], type: AssessmentType, pageSize: number, page: number): Promise<AssessmentForStudent[]> {
        const url = `${this.endpoint}/v1/assessments_for_student`;
        const results = await fetchJsonData<AssessmentsForStudentResponse>(url, `GET`, {
            org_id: organizationId,
            type: type,
            schedule_ids: scheduleIDs,
            page_size: pageSize,
            page: page,
        }, this.auth);

        return results.list;
    }
}
