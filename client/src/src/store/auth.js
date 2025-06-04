import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null,
        id: null,
        email: null,
        role: null,
        isAuthenticated: false,
        isAdmin: false,
    }),
    actions: {
        init() {
            if (typeof window !== 'undefined' && localStorage.getItem('access_token')) {
                this.token = localStorage.getItem('access_token');
                const decodedToken = this.decodeToken(this.token);
                console.log(decodedToken);

                if (decodedToken) {
                    this.id = decodedToken.id;
                    this.email = decodedToken.email;
                    this.isAuthenticated = true;
                    if (decodedToken.role === "admin") {
                        this.isAdmin = true;
                    }
                }
            } else {
                this.logout();
            }
        },
        logout() {
            this.token = null;
            this.id = null;
            this.isAuthenticated = false;
            this.role = null;
            this.email = null;
            this.isAdmin = false;
            localStorage.removeItem('access_token');
        },
        checkToken() {
            return this.token !== null;
        },

        checkAdmin() {
            return this.isAdmin;
        },

        decodeToken(token) {
            try {
                const payload = atob(token.split('.')[1]);
                return JSON.parse(payload);
            } catch (error) {
                console.error('Invalid token format:', error);
                return null;
            }
        },
    }
})