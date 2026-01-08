import { useOidcAuth } from "~/composables/useOidcAuth"

export default defineNuxtRouteMiddleware(() => {

    if (process.server) {
        return
    }

    const { isLoggedIn } = useOidcAuth();

    if (!isLoggedIn()) {
        return navigateTo('/');
    }
})
