import sql from "../utils/db"
import { PostgresError } from "postgres"

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const uid = query.uid

    if (!uid) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing uid parameter',
        })
    }

    try {
        await sql`
        DELETE FROM edge_instances
        WHERE uid = ${uid}
        `
        setResponseStatus(event, 204)
        return { success: true }
    } catch (err) {
        const error = err as PostgresError;
        console.error(error.message)
        throw createError({
            statusCode: 500,
            statusText: `unable to delete from database: ${error.message}`,
        })
    }
})
