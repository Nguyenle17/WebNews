import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';
import Layout from '../layouts/Layout.vue';
import Home from '../views/Home.vue';
import LoginRegister from '../views/LoginRegister.vue'; 
import SummaryNews from '../views/SummaryNews.vue'
import SummaryContent from '../views/SummaryContent.vue';
import WeatherAnalysis from '../views/WeatherAnalysis.vue';

const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '',
                name: 'Home',
                component: Home,
            },
            {
                path: '/login',
                name: 'LoginRegister',
                component: LoginRegister,
            },
            {
                path: '/summary-news',
                name: 'SummaryNews',
                component: SummaryNews,
            },
            {
                path: '/summary-content',
                name: 'SummaryContent',
                component: SummaryContent,
            },
            {
                path: '/weather-analysis',
                name: 'WeatherAnalysis',   
                component: WeatherAnalysis,
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    authStore.init();
    if (to.meta.requireAuth && !authStore.checkToken()) {
        return next({ name: "login" });
    }

    if (to.meta.requireAuthAdmin && !authStore.checkAdmin()) {
        return next({ name: "login" });
    }

    next();
});

export default router;
