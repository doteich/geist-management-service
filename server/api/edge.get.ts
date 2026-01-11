import sql from "../utils/db"
import { EdgeInstance } from "../utils/types"



export default defineEventHandler(async (event) => {
    try {
        const eInstances = await sql<EdgeInstance[]>`
        SELECT uid
        FROM edge_instances;
        `
        return eInstances
    } catch (err) {
        console.error(err)
        throw createError({
            statusCode: 500,
            statusMessage: 'Database connection failed',
        })
    }
})