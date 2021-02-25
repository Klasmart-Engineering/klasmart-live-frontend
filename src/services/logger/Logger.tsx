/** 
 * If anyone knows if we're actually using this logger service, please let me know.
 * It was written by a previous developer(Daniel), and this function is only using in join.tsx.
 * So I'd like to delete it if not needed.
 * From. Isu Ahn
 */

import jwt_decode from "jwt-decode";
import { AuthTokenProvider } from "../auth-token/AuthTokenProvider";

export default async function (logPayload: any): Promise<void> {
    try {
        const logToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkb25naHVuLmNob2lAY2FsbWlkLmNvbSIsIm5hbWUiOiJraWRzbG9vcC1saXZlIiwiY29tbWl0cyI6ImExYjJjM2QifQ.oEbpFaHkR2xC7-x2yip3CLEyZt3bPrdHM3dMJsTt5hg';

        const token = AuthTokenProvider.retrieveToken()
        let tokenPayload = null;
        if (token) {
            tokenPayload = jwt_decode(token) as any;
        }

        fetch("https://log.kidsloop.net/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    `Bearer ${logToken}`,
            },
            body: JSON.stringify({ logPayload, tokenPayload }),
        });
    }
    catch (e) { }
}
