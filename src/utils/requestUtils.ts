import qs from "qs";
import { IAuthenticationService } from "../services/auth/IAuthenticationService";

export async function fetchJsonData<T>(url: string, method: string, parameters?: any, auth?: IAuthenticationService): Promise<T> {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    let init : any = {
        headers,
        method
    };

    if (parameters) {
        switch (method){
            case 'GET':
                url = `${url}?${qs.stringify(parameters, { encodeValuesOnly: true })}`;
                break;
            case 'POST':
                init = {
                    ...init,
                    body: JSON.stringify(parameters)
                }
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

export function downloadDataBlob (url: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.responseType = 'blob';
        request.open('GET', url);

        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE ||
                request.readyState === 4) {
                resolve(request.response);
            }
        };

        request.onerror = () => {
            reject(request.statusText);
        };

        request.ontimeout = () => {
            reject('timeout');
        };

        request.send();
    });
}
