import { IAuthenticationService } from "./IAuthenticationService";

function fetchJson (url: string, overrideInit: RequestInit): Promise<Response> {
    const headers = new Headers();
    headers.append(`Accept`, `application/json`);
    headers.append(`Content-Type`, `application/json`);

    const init = {
        headers,
        method: `GET`,
        ...overrideInit,
    };

    return fetch(url, init);
}

export class AuthenticationService implements IAuthenticationService {
    private readonly endpoint: string;

    constructor (endpoint: string) {
        this.endpoint = endpoint;
    }

    async transfer (token: string): Promise<boolean> {
        const url = `${this.endpoint}/transfer`;
        const response = await fetchJson(url, {
            body: JSON.stringify({
                token,
            }),
            method: `POST`,
            credentials: `include`,
        });

        return response.ok;
    }

    async refresh (): Promise<boolean> {
        const url = `${this.endpoint}/refresh`;
        const response = await fetchJson(url, {
            credentials: `include`,
        });

        return response.ok;
    }

    public redirectToLogin (continuePage = window.location) {
        const url = new URL(this.endpoint);
        if(continuePage) { url.searchParams.set(`continue`, continuePage.toString()); }
        window.location.replace(url.toString());
    }

    async signout (): Promise<void> {
        const url = `${this.endpoint}/signout`;
        await fetchJson(url, {
            credentials: `include`,
        });
    }

    async switchUser (userId: string, retry = true): Promise<boolean> {
        const url = `${this.endpoint}/switch`;
        const response = await fetchJson(url, {
            body: JSON.stringify({
                user_id: userId,
            }),
            method: `POST`,
            credentials: `include`,
        });

        await response.text();

        // NOTE: Token might be expired, so trying again
        // after doing refresh.
        if (!response.ok) {
            const refreshed = await this.refresh();
            if (refreshed && retry) {
                return this.switchUser(userId, false);
            }
        }

        return response.ok;
    }
}
