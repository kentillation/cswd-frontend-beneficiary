import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();

    // State
    const error = ref(null);
    const token = ref(localStorage.getItem('auth_token') || null);
    const beneficiaryId = ref(localStorage.getItem('beneficiary_id') || null);
    
    // Getters
    const isAuthenticated = computed(() => !!token.value);
    const getBeneficiaryId = computed(() => beneficiaryId.value);

    // Actions
    const login = async (credentials) => {
        error.value = null;
        try {
            const response = await apiClient.post('/benefeciary/login', credentials);
            if (response.status === 200) {
                token.value = response.data.access_token;
                beneficiaryId.value = response.data.beneficiary_id;

                localStorage.setItem('auth_token', token.value);
                localStorage.setItem('beneficiary_id', beneficiaryId.value);
                return true;
            }
        } catch (err) {
            error.value = err.response?.data?.message ||
                err.message ||
                'Login failed. Please try again.';
            throw error.value;
        }
    };

    const logout = async () => {
        const currentToken = token.value;
        token.value = null;
        error.value = null;
        beneficiaryId.value = null;

        localStorage.removeItem('auth_token', token.value);
        localStorage.removeItem('beneficiary_id', beneficiaryId.value);
        localStorage.clear();
        try {
            if (currentToken) {
                await apiClient.post('/benefeciary/logout', null, {
                    headers: {
                        Authorization: `Bearer ${currentToken}`
                    },
                    timeout: 1000
                });
            }
        } catch (err) {
            console.error('Logout API error:', err);
        }
        window.location.href = '/';
    };

    const checkAuth = () => {
        if (!isAuthenticated.value && router.currentRoute.value.meta.requiresAuth) {
            logout();
        }
    };

    return {
        token,
        isAuthenticated,
        error,
        beneficiaryId,
        getBeneficiaryId,
        login,
        logout,
        checkAuth,
    };
});