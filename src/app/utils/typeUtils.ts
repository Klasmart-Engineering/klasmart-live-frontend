import { CMSErrorResponse } from "../services/cms/IContentService";

export function instanceOfCMSErrorResponse (object: any): object is CMSErrorResponse {
    return `data` in object && `label` in object;
}
