import { ReadMeDto } from "../dto/readMeDto";
import { useUserServiceApolloClient } from "../userServiceApolloClient";
import {
    gql,
    OperationVariables,
    QueryHookOptions,
    useQuery,
} from "@apollo/client";

const QUERY_ME = gql`
    query {
        me {
            user_id
            username
            given_name
            family_name
            date_of_birth
            memberships {
                organization_id
                status
                roles {
                    role_id
                    role_name
                    status
                }
                organization {
                    organization_id
                    organization_name
                    branding {
                        iconImageURL
                        primaryColor
                    }
                }
            }
        }
    }`;

export const useMeQuery = (options?: QueryHookOptions<ReadMeDto, OperationVariables>) => {
    const { client } = useUserServiceApolloClient();

    const query = useQuery<ReadMeDto>(QUERY_ME, {
        ...options,
        context: {
            client,
        },
    });

    return query;
};
