import { UserManager, User } from 'oidc-client-ts';


let userManager: UserManager;
let listenersAttached = false;

const getManager = () => {


    let config = useRuntimeConfig()


    if (!userManager) {
        const settings = {
            authority: config.public.authority, // Your Keycloak realm URL
            client_id: config.public.clientId, // The Client ID you set in Keycloak
            redirect_uri: config.public.redirectUrl, // The callback URL
            post_logout_redirect_uri: config.public.redirectUrl,
            response_type: 'code', // Use Authorization Code Flow
            scope: config.public.scopes, // Standard OIDC scopes
            loadUserInfo: true, // Optional: auto-loads user profile after login

        };
        userManager = new UserManager(settings);
    }
    return userManager;
};

export const useOidcAuth = () => {


    const manager = getManager();
    const user = useState<User | null>('oidc-user', () => null);


    if (process.client && !listenersAttached) {
        manager.getUser().then(result => {
            user.value = result;
        });

        manager.events.addUserLoaded(loadedUser => {
            user.value = loadedUser;
        });

        manager.events.addUserUnloaded(() => {
            user.value = null;
        });

        listenersAttached = true;
    }

    const login = () => {
        return manager.signinRedirect();
    };

    const logout = () => {
        return manager.signoutRedirect();
    };

    const isLoggedIn = () => {
        return user.value?.access_token ? true : false

    }

 
    return {
        manager,
        user,
        login,
        logout,
        isLoggedIn
    };
};