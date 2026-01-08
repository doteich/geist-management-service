import sql from "../utils/db"

export default defineEventHandler(async (event) => {
    try {
        // Standard SQL query
        const tasks = await sql`
        SELECT id, enabled, full_scope_allowed, client_id, not_before, public_client, secret, base_url, bearer_only, management_url, surrogate_auth_required, realm_id, protocol, node_rereg_timeout, frontchannel_logout, consent_required, name, service_accounts_enabled, client_authenticator_type, root_url, description, registration_token, standard_flow_enabled, implicit_flow_enabled, direct_access_grants_enabled, always_display_in_console
        FROM public.client;
        `
        return tasks
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Database connection failed',
        })
    }
})