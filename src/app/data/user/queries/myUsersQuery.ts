import { ReadMyUsersDto } from "../dto/readMyUsersDto";
import { useUserServiceApolloClient } from "../userServiceApolloClient";
import {
    gql,
    OperationVariables,
    QueryHookOptions,
    useQuery,
} from "@apollo/client";

const QUERY_MY_USERS = gql`
    query {
        my_users {
            user_id
            username
            given_name
            family_name
            date_of_birth
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
