import { PostgresError } from "postgres"
import sql from "../utils/db"
import { EdgeInstance } from "../utils/types"

export default defineEventHandler(async (event) => {
    const body: EdgeInstance = await readBody(event)
    try {
        const [uid] = await sql`
        INSERT INTO edge_instances (name, host, namespace, workflow, kube_version)
        VALUES (${body.name}, ${body.host}, ${body.namespace}, ${body.workflow}, ${body.kubeVersion})
        RETURNING uid
        `
        console.log("created edge instance with uid: ", uid)
        setResponseStatus(event, 201)
        return uid
    } catch (err) {
        const error = err as PostgresError;

        console.error(error.message)
        throw createError({
            statusCode: 500,
            statusText: `unable to insert into database: ${error.message}`,
        })


    }
})