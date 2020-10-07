import { sign, Secret, SignOptions } from "jsonwebtoken"
import { readFileSync } from "fs"
import { v5 } from "uuid"

import jwksClient, { JwksClient } from "jwks-rsa"
import { decode, JwtHeader, verify, VerifyErrors } from "jsonwebtoken"

export const accessTokenDuration = Number(process.env.JWT_ACCESS_TOKEN_DURATION) || 300
export const refreshTokenDuration = Number(process.env.JWT_REFRESH_TOKEN_DURATION) || 1209600
export const httpsOnlyCookie = process.env.JWT_COOKIE_ALLOW_HTTP === undefined

const issuer = process.env.JWT_ISSUER
const config = jwtInit()

export function verifyRefreshToken(encodedToken: string) {
    return new Promise((resolve, reject) => {
        verify(
            encodedToken,
            config.secret,
            config.refreshTokenOptions,
            (err, decoded)=>{
                if(err) { reject(err); return }
                if(decoded) { resolve(decoded); return }
                reject("Unexpected error, token validation did not succeed but did not return an error")
            }
        )
    })
}
export function signAccessToken(token: IdToken) {
    return signJWT(token, config.secret, config.accessTokenOptions)
}

export function signRefreshToken(refreshToken: object) {
    return signJWT(refreshToken, config.secret, config.refreshTokenOptions)
}

export async function signJWT(token: Object, secret: Secret, options: SignOptions) {
    return new Promise<string>((resolve, reject) => {
        sign(token, secret, options, (err, encoded) => {
            if (encoded) {
                resolve(encoded)
            } else {
                reject(err)
            }
        })
    })
}

function jwtInit(): { secret: Secret, accessTokenOptions: SignOptions, refreshTokenOptions: SignOptions } {
    const algorithm = process.env.JWT_ALGORITHM


    const accessTokenOptions = {
        algorithm,
        expiresIn: accessTokenDuration,
        issuer,
        noTimestamp: true,
    } as SignOptions

    const refreshTokenOptions = {
        algorithm,
        issuer,
        expiresIn: refreshTokenDuration,
        subject: "refresh"
    } as SignOptions

    switch (algorithm) {
        case "HS256":
        case "HS384":
        case "HS512":
            if (process.env.JWT_PRIVATE_KEY || process.env.JWT_PRIVATE_KEY_FILENAME) {
                throw new Error(`JWT configuration error - can not use '${algorithm}' algorithm with private key, please set JWT_SECRET enviroment variable`)
            }
            if (process.env.JWT_SECRET) {
                return {
                    secret: process.env.JWT_SECRET,
                    accessTokenOptions,
                    refreshTokenOptions,
                }
            }
        case "RS256":
        case "RS384":
        case "RS512":
        case "ES256":
        case "ES384":
        case "ES512":
        case "PS256":
        case "PS384":
        case "PS512":
            if (process.env.JWT_SECRET) {
                throw new Error(`JWT configuration error - can not use '${algorithm}' algorithm with jwt secret key, please set JWT_PRIVATE_KEY or JWT_PRIVATE_KEY_FILENAME enviroment variable`)
            }
            if (process.env.JWT_PRIVATE_KEY && process.env.JWT_PRIVATE_KEY_FILENAME) {
                throw new Error(`JWT configuration error - please use either JWT_PRIVATE_KEY or JWT_PRIVATE_KEY_FILENAME not both`)
            }
            if (process.env.JWT_PRIVATE_KEY_FILENAME) {
                return {
                    secret: readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME),

                    accessTokenOptions,
                    refreshTokenOptions,
                }
            }
            if (process.env.JWT_PRIVATE_KEY) {
                return {
                    secret: process.env.JWT_PRIVATE_KEY,

                    accessTokenOptions,
                    refreshTokenOptions,
                }
            }
            throw new Error(`JWT configuration error - need jwt private key, please set JWT_PRIVATE_KEY or JWT_PRIVATE_KEY_FILENAME enviroment variable`)
        default:
            throw new Error("JWT Token not configured")
    }
}

export interface IdToken {
    id: string,
    email?: string,
    name?: string,
}

export async function transferToken(encodedToken: string): Promise<IdToken> {
    const { header, payload } = decode(encodedToken, { complete: true }) as { header: JwtHeader, payload: any }
    const issuer = payload.iss
    const keyId = typeof header.kid === "string" ? header.kid : undefined

    if (typeof issuer !== "string") { throw new Error("Unknown issuer"); }

    const config = issuers.get(issuer)
    if (!config) { throw new Error(`Unknown Issuer(${issuer})`) }

    const key = await config.getPublicKeyOrSecret(keyId)
    if (!key) { throw new Error(`Unable to get verification secret or public key for Issuer(${payload.iss}) and KeyId(${header.kid})`) }

    console.log(key)
    return new Promise<IdToken>((resolve, reject) => {
        verify(
            encodedToken,
            key,
            {},
            (err: VerifyErrors | null, decoded: object | undefined) => {
                if (err) { reject(err); return }
                if (decoded) {
                    try {
                        const token = config.createToken(decoded)
                        resolve(token)
                        return;
                    } catch (e) {
                        reject(e);
                        return
                    }
                }
                reject("Unexpected error, token validation did not succeed but did not return an error")
            },
        )
    })
}

export interface IssuerConfig {
    getPublicKeyOrSecret(keyId?: string): Promise<Secret>
    createToken(token: object): IdToken
}

class GoogleIssuerConfig implements IssuerConfig {
    private client = jwksClient({
        strictSsl: true,
        jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
    })
    private namespace = v5("accounts.google.com", v5.DNS)

    public async getPublicKeyOrSecret(keyId?: string) {
        if (!keyId) { throw new Error(`Unable to get public key for Issuer(accounts.google.com) due to missing keyId(${keyId})`) }
        const response = await this.client.getSigningKeyAsync(keyId)
        return response.getPublicKey()
    }
    public createToken(token: any) {
        console.log(token)
        function email() {
            if (typeof token.email === "string") { return token.email }
            return undefined
        }
        function name() {
            if (typeof token.given_name === "string") {
                if (typeof token.family_name === "string") {
                    return `${token.given_name}${token.family_name}`.trim()
                }
                return token.given_name.trim()
            }
            return undefined
        }

        return {
            id: v5("", this.namespace),
            email: email(),
            name: name(),
        }
    }
}

const issuers = new Map<string, IssuerConfig>([
    ["accounts.google.com", new GoogleIssuerConfig()],
    /*
    ["KidsLoopChinaUser-live"]
    "-----BEGIN PUBLIC KEY-----",
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAGN9KAcc61KBz8EQAH54bFwGK",
    "6PEQNVXXlsObwFd3Zos83bRm+3grzP0pKWniZ6TL/y7ZgFh4OlUMh9qJjIt6Lpz9",
    "l4uDxkgDDrKHn8IrflBxjJKq0OyXqwIYChnFoi/HGjcRtJhi8oTFToSvKMqIeUuL",
    "mWmLA8nXdDnMl7zwoQIDAQAB",
    "-----END PUBLIC KEY-----"
    */
    /*
    ["badanamu AMS"] //Dev
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQChCrS9+Bt8tpsJQNpo0CkQMAmX
gxRXYJwBdn0Bf3Gks5dJF6THHjQMQmBKbdlZ7EsM46oveYf3UnJXH7X7xgBNBvHq
QLEnCvgze0Yi66ul0Rf0GKH6ImMUBfUVksn+sOJ/6c+uzcscEljy/eCKYaWKoMMQ
EDkqiqxrS3EewLpRxQIDAQAB
-----END PUBLIC KEY-----
    */
    /*
   ["badanamu AMS"] //Prod
-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHGWLk3zzoWJ6nJhHEE7LtM9LCa1
8OSdVQPwvrFxBUTRHz0Hl+qdNMNHJIJkj9NEjL+kaRo0XxsGdrR6NGxL2/WiX3Zf
H+xCTJ4Wl3pIc3Lrjc8SJ7OcS5PmLc0uXpb0bDGen9KcI3oVe770y6mT8PWIgqjP
wTT7osO/AOfbIsktAgMBAAE=
-----END PUBLIC KEY-----
    */
])
