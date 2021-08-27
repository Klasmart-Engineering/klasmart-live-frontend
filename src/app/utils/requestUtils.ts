import { IAuthenticationService } from "../services/auth/IAuthenticationService";
import qs from "qs";

export async function fetchJsonData<T> (url: string, method: string, parameters?: any, auth?: IAuthenticationService): Promise<T> {
    const headers = new Headers();
    headers.append(`Accept`, `application/json`);
    headers.append(`Content-Type`, `application/json`);

    let init : any = {
        headers,
        method,
    };

    if (parameters) {
        switch (method){
        case `GET`:
            url = `${url}?${qs.stringify(parameters, {
                encodeValuesOnly: true,
            })}`;
            break;
        case `POST`:
            init = {
                ...init,
                body: JSON.stringify(parameters),
            };
            break;
        }
    }

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
