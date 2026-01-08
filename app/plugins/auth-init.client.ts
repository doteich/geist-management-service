import { useOidcAuth } from "~/composables/useOidcAuth";



export default defineNuxtPlugin(async () => {
    const { manager, user } = useOidcAuth();

    // By awaiting manager.getUser(), we ensure the user is loaded before the app continues rendering.
    // This prevents the middleware from running before the auth state is known.
    const userFromManager = await manager.getUser();
    if (userFromManager) {
        user.value = userFromManager;
    }
});
