// server/api/validate-edge.post.ts
import { isSafeUrl } from '../utils/ssrf' // Using the checker from earlier
interface ConnectResponse {
  namespace: string,
  kubernetesVersion: string
}
export default defineEventHandler(async (event) => {
  const { url } = await readBody(event)

  // 1. Security Check: Prevent SSRF
  if (!(await isSafeUrl(url))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or restricted URL.'
    })
  }

  try {
    // 2. Performance: Short timeout (3s) so the UI doesn't hang
    const data: ConnectResponse = await $fetch(`${url}/v1/connect`, {
      timeout: 3000,
      headers: {
        // If your edge requires the Keycloak token for this check:
        'Authorization': getHeader(event, 'authorization') || ''
      }
    })

    // 3. Requirement Check: Validate the response body
    if (data?.kubernetesVersion && data?.namespace) {
      return {
        valid: true,
        metadata: {
          version: data.kubernetesVersion,
          namespace: data.namespace
        }
      }
    }

    throw new Error('Missing required metadata')
  } catch (err) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Connection failed or invalid response format.'
    })
  }
})