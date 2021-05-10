import { IAuthenticationService } from "./IAuthenticationService";

function fetchJson(url: string, overrideInit: RequestInit): Promise<Response> {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    const init = {
        headers,
        method: "GET",
        ...overrideInit
    }

    return fetch(url, init);
}

export class AuthenticationService implements IAuthenticationService {
    private endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    async transfer(token: string): Promise<boolean> {
        const url = `${this.endpoint}/transfer`;
        const response = await fetchJson(url, {
            body: JSON.stringify({ token }),
            method: "POST",
        });

        return response.ok;
    }

    async refresh(): Promise<boolean> {
        const url = `${this.endpoint}/refresh`;
        const response = await fetchJson(url, {
            credentials: "include",
        });

        return response.ok;
    }

    async signout(): Promise<void> {
        const url = `${this.endpoint}/signout`;
        await fetchJson(url, { credentials: "include" })
    }
}