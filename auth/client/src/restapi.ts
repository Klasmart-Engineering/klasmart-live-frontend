import { RestAPIError, RestAPIErrorType } from "./restapi_errors";

export async function login(id: string, password: string) {
    try {
        const { phoneNr, email } = phoneOrEmail(id);
        const response = await authCall(
            "/v1/login",
            JSON.stringify({
                deviceId: "webpage",
                deviceName: navigator.userAgent,
                email,
                phoneNr,
                pw: password,
            }),
        );
        if (response.status !== 200) {
            return false;
        }
        const body = await response.json();
        console.log(body)
        return body;
    } catch (e) {
        throw e;
    }
}

function phoneOrEmail(str: string): { phoneNr?: string, email?: string } {
    if (str.indexOf("@") === -1) {
        return { phoneNr: str };
    } else {
        return { email: str };
    }
}

function authCall(route: string, body: string) {
    return fetchRoute("POST", "https://prod.auth.badanamu.net", route, body)
}

async function fetchRoute(method: string, prefix: string, route: string, body?: string) {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    const url = prefix + route;
    const response = await fetch(url, {
        body,
        headers,
        method,
    });

    if (response.status === 200) { return response; }

    const responseBody = await response.json();
    let errCode = RestAPIErrorType.UNKNOWN;
    let errParams;
    if (typeof responseBody.errCode === "number") {
        errCode = responseBody.errCode;
    }
    if (typeof responseBody.errParams === "object") {
        errParams = responseBody.errParams;
    }
    throw new RestAPIError(errCode, errParams);

}