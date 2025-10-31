<template>
    <div class="login-bg">
        <div>
            <v-sheet>
                <div class="d-flex justify-center">
                    <img :src="logo" loading="lazy" width="50" alt="Logo" />
                </div>
                <v-form ref="form" @submit.prevent="handleLogin" v-model="isFormValid" class="pa-4">
                    <span class="text-white">Email</span>
                    <v-text-field v-model="email" 
                        :rules="[requiredRule, emailFormatRule]"
                        placeholder="Type here..."
                        class="text-info"
                        prepend-inner-icon="mdi-email-outline"
                        variant="outlined"
                        density="compact"
                        autocomplete="email" />

                    <span class="text-white">Password</span>
                    <v-text-field v-model="password" 
                        :rules="[requiredRule]"
                        placeholder="Type here..."
                        class="text-info"
                        prepend-inner-icon="mdi-lock-outline" 
                        variant="outlined"
                        density="compact" 
                        autocomplete="password"
                        :type="showPassword ? 'text' : 'password'"
                        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye-outline'" 
                        @click:append-inner="showPassword = !showPassword" />
                        <span class="forgot-pass" 
                            @click="$router.push('/forgot-password')">
                            Forgot password?
                        </span>


                    <v-btn :disabled="!isFormValid || loading" type="submit" color="#004fb6" size="large" class="proceed-btn" height="45" block rounded>
                        Login
                    </v-btn>
                    
                    <h6 class="system-version text-center">Digita ID and Verification Service System <br /> UAT v1.0.0</h6>
                </v-form>
            </v-sheet>
            <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="4000"  class="mt-7" location="top">
                {{ snackbar.message }}
            </v-snackbar>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import { shallowRef } from 'vue';

export default {
    name: 'LoginPage',
    setup() {
        const loadingStore = useLoadingStore();
        return {
            mpin: shallowRef(''),
            loadingStore,
        };
    },
    data() {
        return {
            logo: require('@/assets/DSWD-logo.png'),
            email: '',
            password: '',
            showPassword: false,
            isFormValid: false,
            loading: false,
            snackbar: {
                visible: false,
                message: '',
                color: ''
            },
        };
    },
    methods: {
        requiredRule(v) {
            return !!v || 'This field is required';
        },
        emailFormatRule(v) {
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return pattern.test(v) || 'Invalid email format';
        },
        async handleLogin() {
            const isValid = await this.$refs.form.validate();
            if (!isValid) return;

            this.loading = true;
            try {
                this.loadingStore.show('');
                const authStore = useAuthStore();
                await authStore.login({ email: this.email, password: this.password });
                window.location.href = '/digital-id';
            } catch (error) {
                this.showSnackbar(error || 'Login failed. Please try again!', 'error');
            } finally {
                this.loading = false;
                this.loadingStore.hide();
            }
        },
        showSnackbar(message, color) {
            this.snackbar.message = message;
            this.snackbar.color = color;
            this.snackbar.visible = true;
        }
    }
};
</script>

<style scoped>
* {
    margin: 0 !important;
    padding: 0 !important;
}
.login-bg {
    width: 100vw;
    height: 100vh;
}

.v-container {
    align-items: center;
}

.v-sheet {
    margin-left: 0 !important;
}

.v-form {
    padding: 50px !important;
    background-color: #000f50;
    border-radius: 100px;
    height: 100dvh;
}

img {
    min-width: 70px;
    width: 40%;
    border-radius: 10px;
    padding: 50px;
    margin-top: 25px !important;
    margin-bottom: 25px !important;
}

.forgot-pass {
    position: absolute;
    color: #454bff;
    font-size: 14px;
    margin-top: -18px !important;
    right: 50px;
}

.v-input__details {
    display: flex;
}

.proceed-btn {
    margin-top: 20px !important;
}

.register-btn {
    margin-top: 10px !important;
    border: 1px solid #fff;
    background-color: transparent;
}

.system-version {
    margin-top: 100px !important;
    color: #d3eaff;
}
</style>