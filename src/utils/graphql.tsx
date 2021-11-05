import { gql } from "@apollo/client";

export const ORGANIZATION_BRANDING_QUERY = gql`
    query organization($organization_id: ID!) {
        organization(organization_id: $organization_id) {
            branding{
                iconImageURL
                faviconImageURL
                primaryColor
            }
        }
    }
`;
