import sql from "../../../utils/db"


export default defineEventHandler(async (event) => {
    const instanceId = getRouterParam(event, 'instanceId') || 1
    const slug = getRouterParam(event, 'slug')

    // 1. Try to get the URL from Nitro's internal memory/cache
    const storage = useStorage('cache')
    let targetBaseUrl = await storage.getItem(`instance:${instanceId}`)

    // 2. If not in cache, fetch from your Database


    if (!targetBaseUrl) {
        const eInstances = await sql<EdgeInstance[]>`
        SELECT *
        FROM edge_instances
        WHERE uid = ${instanceId};`

        if (!eInstances || eInstances.length < 1) {
            throw createError({ statusCode: 404, message: 'Edge instance not found' })
        }

        targetBaseUrl = eInstances[0].host
        // 3. Cache it for 1 hour to save DB load
        await storage.setItem(`instance:${instanceId}`, targetBaseUrl, { ttl: 36000 })
    }

    // 4. Proxy the request to the dynamically discovered URL
    return proxyRequest(event, `${targetBaseUrl}/${slug}`)
})