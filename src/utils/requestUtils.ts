import qs from "qs";
import { IAuthenticationService } from "../services/auth/IAuthenticationService";

export async function fetchJsonData<T>(url: string, method: string, parameters?: any, auth?: IAuthenticationService): Promise<T> {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    if (parameters) {
        url = `${url}?${qs.stringify(parameters, { encodeValuesOnly: true })}`;
    }

    const init = {
        headers,
        method
    };

    let response = await fetch(url, init);
    if (response.status === 401 && auth) {
        const refreshed = await auth.refresh();
        if (refreshed) {
            response = await fetch(url, init);
        }
    }

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
}
