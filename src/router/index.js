import { createRouter, createWebHistory } from 'vue-router';
import NotFound from '@/views/NotFound.vue';
import LoginPage from '@/views/Login.vue';
import RegisterPage from '@/views/Register.vue';
import ForgotPassword from '@/views/ForgotPassword.vue';
import DigitalID from '@/views/DigitalID.vue';
import History from '@/views/History.vue';
import Releasing from '@/views/Releasing.vue';
import Profile from '@/views/Profile.vue';
import { useAuthStore } from '@/stores/auth';

const routes = [
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
    { path: '/', name: 'LoginPage', component: LoginPage, meta: { requiresAuth: false } },
    { path: '/register', name: 'RegisterPage', component: RegisterPage, meta: { requiresAuth: false } },
    { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword, meta: { requiresAuth: false } },
    { path: '/digital-id', name: 'DigitalID', component: DigitalID, meta: { requiresAuth: true } },
    { path: '/history', name: 'History', component: History, meta: { requiresAuth: true } },
    { path: '/releasing', name: 'Releasing', component: Releasing, meta: { requiresAuth: true } },
    { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    authStore.checkAuth(); // Optional: Check token validity
    
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return '/';
    }
    
    if (to.path === '/' && authStore.isAuthenticated) {
        return '/digital-id';
    }
});

export default router;
