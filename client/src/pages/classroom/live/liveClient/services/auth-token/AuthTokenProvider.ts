
export class AuthTokenProvider {
    static retrieveToken() : string | null {
        // TODO: This following line just assumes the search part of location
        // begins with a '?' character. We may want to do some more robust 
        // parsing of the querystring. This seem to work in most cases I've
        // tried though.
        const url = new URL(window.location.href)
        let candidate = url.searchParams.get('token')
        try {
            if (!candidate) {
                const storedToken = localStorage.getItem('token')
                if (storedToken) {
                    candidate = storedToken
                }
            }
        } catch(e) { }

        return candidate
    }
}