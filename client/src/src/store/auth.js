import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        id: null,
        fullname: null,
        email: null,
        role: null,
        phone: null,
        address: null,
        isAuthenticated: false,
        isAdmin: false,
    }),
    actions: {
        init() {
            if (typeof window !== 'undefined' && localStorage.getItem('user')) {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    this.id = user.id;
                    this.email = user.email;
                    this.fullname = user.fullname;
                    this.role = user.role;
                    this.phone = user.phone;
                    this.address = user.address;
                    this.isAuthenticated = true;
                    this.isAdmin = user.role === "admin";
                }
            } else {
                this.logout();
            }
        },
        logout() {
            this.user = null;
            this.id = null;
            this.isAuthenticated = false;
            this.role = null;
            this.email = null;
            this.isAdmin = false;
            localStorage.removeItem('user');
        },

        updated() {
            if (typeof window !== 'undefined' && localStorage.getItem('user')) {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    this.fullname = user.fullname;
                    this.phone = user.phone;
                    this.address = user.address;
                    this.isAuthenticated = true;
                }
            } else {
                this.logout();
            }
        },
        checkLogin() {
            return this.id !== null;
        },

        checkAdmin() {
            return this.isAdmin;
        },
    }
})