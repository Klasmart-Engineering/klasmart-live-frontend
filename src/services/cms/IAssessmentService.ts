export type StudentAttachment = {
    id: string,
    name: string
}

export type AssessmentForStudent = {
    complete_at: number,
    created_at: number,
    id: string,
    schedule: {id: string}
    status: string,
    student_attachments?: StudentAttachment[]
}

export type AssessmentsForStudentResponse = {
    list: AssessmentForStudent[]
}

export enum AssessmentType{
    HOME_FUN_STUDY = 'home_fun_study'
}

export enum AssessmentStatusType {
    IN_PROGRESS = 'in_progress',
    COMPLETE = 'complete'
}
/**
 * Client side API interface for: https://swagger-ui.kidsloop.net/#/assessments
 */
export interface IAssessmentService {
    getAssessmentsForStudent(organizationId: string, scheduleIDs: string[], type: AssessmentType, pageSize: number, page: number): Promise<AssessmentForStudent[]>;
}
