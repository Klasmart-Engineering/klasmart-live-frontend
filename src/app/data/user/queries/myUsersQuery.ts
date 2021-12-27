import { ReadMyUsersDto } from "../dto/readMyUsersDto";
import { useUserServiceApolloClient } from "../userServiceApolloClient";
import {
    gql,
    OperationVariables,
    QueryHookOptions,
    useQuery,
} from "@apollo/client";

const QUERY_MY_USERS = gql`
    query queryMyUsers {
        my_users {
            user_id
            username
            given_name
            family_name
            date_of_birth
            organizationsWithPermission (permission_name: "attend_live_class_as_a_student_187") {
                status
                roles {
                    role_name
                }
                organization {
                    organization_id
                    organization_name
                }
            }
        }
    }
`;

export const useMyUsersQuery = (options?: QueryHookOptions<ReadMyUsersDto, OperationVariables>) => {
    const { client } = useUserServiceApolloClient();
    const query = useQuery<ReadMyUsersDto>(QUERY_MY_USERS, {
        ...options,
        client,
    });

    return query;
};
