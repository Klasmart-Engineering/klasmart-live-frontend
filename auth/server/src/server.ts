import bodyParser from "body-parser"
import express, { Request, Response } from "express"
import { accessTokenDuration, httpsOnlyCookie, refreshTokenDuration, signAccessToken, signRefreshToken, transferToken, verifyRefreshToken } from "./jwt";
import { RefreshTokenManager } from "./refreshToken";
import { validateString } from "./util/validate";
import cookieParser from "cookie-parser"

const domain = process.env.DOMAIN

export class AuthServer {
    public static async create() {
        const tokenManager = await RefreshTokenManager.create()
        const server = new AuthServer(tokenManager)

        const jsonParser = bodyParser.json()

        const app = express()
        app.use(cookieParser())
        app.use(jsonParser)
        app.post('/transfer', (req, res) => server.transfer(req, res))
        app.get('/refresh', (req, res) => server.refresh(req, res))

        return new Promise<AuthServer>((resolve, reject) => {
            const port = process.env.PORT || 8080
            app.listen(port, () => {
                console.log(`🌎 Server ready at http://localhost:${port}`)
                resolve(server)
            })
        })
    }

    private refreshTokenManager: RefreshTokenManager
    private constructor(tokenManager: RefreshTokenManager) {
        this.refreshTokenManager = tokenManager
    }

    private async transfer(req: Request, res: Response) {
        try {
            const encodedToken = validateString(req.body.token)
            if (!encodedToken) { throw new Error("No token") }
            const session_name = req.get("User-Agent") || "Unkown Device"

            const token = await transferToken(encodedToken)

            
            const accessToken = await signAccessToken(token)
            const refreshToken = await this.refreshTokenManager.createSession(session_name, token)
            this.setTokenCookies(res, refreshToken, accessToken)
            
            res.status(200)
            res.end()
            return
        } catch (e) {
            console.error(e)
            res.statusMessage = "Invalid Token"
            res.status(400)
            res.end()
        }
    }

    private async refresh(req: Request, res: Response) {
        try {
            const session_name = req.get("User-Agent") || "Unkown Device"
            console.log("refresh", session_name)
            console.log(req.cookies.refresh)
            const encodedToken = validateString(req.cookies.refresh)
            console.log(encodedToken)
            if (!encodedToken) { throw new Error("No token") }

            const {refreshToken, accessToken} = await this.refreshTokenManager.refreshSession(session_name, encodedToken)
            this.setTokenCookies(res, refreshToken, accessToken)

            res.status(200)
            res.end()
        } catch(e) {
            console.error(e)
            res.statusMessage = "Invalid Token"
            res.status(400)
            res.end()
        }
    }

    private setTokenCookies(res: Response, refreshToken: string, accessToken: string) {
        res.cookie("access", accessToken, {
            domain,
            httpOnly: true,
            maxAge: accessTokenDuration,
            secure: httpsOnlyCookie,
        })
        res.cookie("refresh", refreshToken, {
            path: "/refresh",
            httpOnly: true,
            maxAge: refreshTokenDuration,
            secure: httpsOnlyCookie,
        })
    }
}