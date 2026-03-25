import { useOidcAuth } from "~/composables/useOidcAuth"

export default defineNuxtRouteMiddleware((to, from) => {
    const { isLoggedIn } = useOidcAuth();

    // Prevent infinite redirect if already going to '/'
    if (to.path === '/') {
        return
    }

    if (!isLoggedIn()) {
        return navigateTo('/')
    }
})