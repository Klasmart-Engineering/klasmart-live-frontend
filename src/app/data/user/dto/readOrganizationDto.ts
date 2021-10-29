
export interface ReadOrganizationDto {
    organization_id: string;
    organization_name?: string;
    branding?: {
        iconImageURL: string;
        primaryColor: string;
    };
}
