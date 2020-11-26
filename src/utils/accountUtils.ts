import queryString from "query-string";

interface User {
    avatar: string,
    email: string,
    user_id: string,
    user_name: string,
}

const AUTH_ENDPOINT = "https://auth.kidsloop.net";
const USER_ENDPOINT = "https://api.kidsloop.net";

export async function transferToken(token: string): Promise<boolean> {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    const response = await fetch(`${AUTH_ENDPOINT}/transfer`, {
        body: JSON.stringify({ token }),
        headers,
        method: "POST",
    });
    await response.text()

    return response.ok;
}

export async function refreshAuthenticationToken(): Promise<boolean> {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    const response = await fetch(`${AUTH_ENDPOINT}/refresh`, {
        credentials: "include",
        headers,
        method: "GET",
    });

    return response.ok;
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
    const response = await fetch(`${USER_ENDPOINT}/user/`, {
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
    const response = await fetch(`${USER_ENDPOINT}/user/`, {
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
                if (window.location.origin === AUTH_ENDPOINT) { return; }
                const stringifiedQuery = queryString.stringify({ continue: continueParam ? continueParam : window.location.href });
                window.location.href = `${AUTH_ENDPOINT}/?${stringifiedQuery}#/`
            }
            return;
        });
}
