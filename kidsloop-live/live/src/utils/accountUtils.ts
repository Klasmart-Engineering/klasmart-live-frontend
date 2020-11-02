import queryString from "query-string";

interface User {
    avatar: string,
    email: string,
    user_id: string,
    user_name: string,
}

export async function checkUserAuthenticated(): Promise<boolean> {
    const GET_SELF = `query {
        me { 
            user_id
        }
    }`

    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    const response = await fetch("https://api.kidsloop.net/user/", {
        body: JSON.stringify({ query: GET_SELF }),
        credentials: "include",
        headers,
        method: "POST",
    });

    const { data } = await response.json();

    return data && data.me !== null;
}

export async function redirectIfUnauthorized(continueParam?: string) {
    const GET_SELF = `query {
        me { 
            avatar
            email
            user_id
            user_name
        }
    }`

    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    const response = await fetch("https://api.kidsloop.net/user/", {
        body: JSON.stringify({ query: GET_SELF }),
        credentials: "include",
        headers,
        method: "POST",
    })
        .then(r => r.json())
        .then(data => {
            const response = data;
            // console.log(response);
            const me: User = response.data.me;
            // console.log("redirectIfUnauthorized me: ", me);
            if (me === null) {
                if (window.location.origin === "https://auth.kidsloop.net") { return; }
                const stringifiedQuery = queryString.stringify({ continue: continueParam ? continueParam : window.location.href });
                window.location.href = `https://auth.kidsloop.net/?${stringifiedQuery}#/`
            }
            return;
        });
}

// TODO: WIP
// export async function getUserAuthenticatedInfo(): Promise<any> {
//     const CALM_ISLAND = "44fa30db-365a-4589-a304-3c8a801debb5"
//     const GET_SELF = `query {
//         me {
//             user_id
//             user_name
//             email
//             avatar
//             membership(organization_id: ${CALM_ISLAND}) {
//                 organization {
//                     organization_id
//                     organization_name
//                 }
//                 roles {
//                     role_id
//                     role_name
//                 }
//             }
//         }
//     }`

//     const headers = new Headers();
//     headers.append("Accept", "application/json");
//     headers.append("Content-Type", "application/json");
//     const response = await fetch("https://api.kidsloop.net/user/", {
//         body: JSON.stringify({ query: GET_SELF }),
//         credentials: "include",
//         headers,
//         method: "POST",
//     });

//     const { me } = await response.json();
//     console.log(`getUserAuthenticatedInfo me: ${JSON.stringify(me)}`);

//     return me
// }