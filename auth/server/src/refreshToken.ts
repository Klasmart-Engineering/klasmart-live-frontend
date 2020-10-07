import { v4 } from "uuid";
import { Client, DseClientOptions, mapping } from 'cassandra-driver';
import { IdToken, refreshTokenDuration, signAccessToken, signRefreshToken, verifyRefreshToken } from "./jwt";



export class RefreshTokenManager {
    public static async create() {
        const params: DseClientOptions = {
            contactPoints: [process.env.CASSANDRA_ENDPOINT || 'localhost'],
            localDataCenter: process.env.CASSANDRA_DATACENTER || 'datacenter1',
        }
        const client = new Client(params);
        const mapper = new mapping.Mapper(
            client,
            {
                models: {
                    'sessions': {
                        keyspace: "auth",
                        tables: [
                            { name: 'sessions', isView: false },
                        ],
                        mappings: new mapping.DefaultTableMappings(),
                    },
                }
            }
        )
        await client.connect()
        console.log("👁️  Connected to cassandraDB")

        try {
            await client.execute(create_keyspace)
            await client.execute(use_keyspace)
            await client.execute(create_session_table)
        } catch (e) {
            console.error("Unable to intialize cassandraDB")
            console.error(e)
            throw e
        }
        return new RefreshTokenManager(mapper)
    }

    private mapper: mapping.Mapper
    public constructor(mapper: mapping.Mapper) {
        this.mapper = mapper
    }

    public async createSession(session_name: string, token: IdToken) {
        const session_id = v4()
        const result = await this.mapper.forModel("sessions").insert({
            session_id,
            session_name,
            jwt: JSON.stringify(token),
            creation: Date.now(),
        }, { ttl: refreshTokenDuration })
        const encodedToken = await signRefreshToken({session_id, token}) 
        return encodedToken
    }

    public async refreshSession(session_name: string, encodedRefreshToken: string) {
        const previousRefreshToken = await verifyRefreshToken(encodedRefreshToken) as RefreshToken
        if(typeof previousRefreshToken !== "object") { throw new Error("Refresh token was of an unexpected type") }
        const { session_id, token } = previousRefreshToken
        if(typeof session_id !== "string") { throw new Error("session_id was of an unexpected type")}

        // Get session then Delete session is not atomic
        // This creates a race condition where it would be possible for a session to be refreshed into
        // TODO:
        const session: Session|undefined = await this.mapper.forModel("sessions").get({ session_id })
        if(!session) { throw new Error("Session not found") }
        await this.mapper.forModel("sessions").remove({ session_id })

        const [
            accessToken,
            refreshToken
        ] = await Promise.all([
            signAccessToken(token),
            this.createSession(session_name, token),
        ]) 

        return { accessToken, refreshToken }
    }
}

const create_keyspace =
    `CREATE KEYSPACE IF NOT EXISTS "auth"
WITH replication = {
    'class': 'SimpleStrategy',
    'replication_factor': 3
};`

const use_keyspace =
    `USE "auth";`


const create_session_table =
    `CREATE TABLE IF NOT EXISTS sessions (
    session_id uuid PRIMARY KEY,
    session_name text,
    jwt text,
    creation timestamp
)`

export interface Session {
    session_id: string,
    session_name: string,
    jwt: string,
    creation: number,
}

export interface RefreshToken {
    session_id: string,
    token: IdToken
}