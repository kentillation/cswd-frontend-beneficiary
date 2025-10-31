<template>
    <div class="login-bg">
        <v-container class="d-flex align-center justify-center">
            <v-sheet>
                <div class="d-flex justify-center">
                    <img :src="logo" loading="lazy" alt="Logo" />
                </div>
                <v-form ref="newCustomerForm" @submit.prevent="submitNewBranch" v-model="isFormValid" class="pa-4">
                    <div class="registration-text">
                        <h3 class="position-absolute" style="top: 210px;">R E G I S T R A T I O N</h3>
                    </div>
                    <br />

                    <span class="text-white">Username</span>
                    <v-text-field v-model="user_name" 
                        :rules="[requiredRule]"
                        placeholder="Type here..."
                        class="text-info"
                        prepend-inner-icon="mdi-account-outline"
                        variant="outlined"
                        density="compact"
                        autocomplete="user_name" />

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

                    <v-btn :disabled="!isFormValid || loading" type="submit" color="#004fb6" size="large" class="mt-3 mb-3" height="45" block rounded>
                        Create
                    </v-btn>
                    <span class="text-white">Has already an account?
                        <span @click="$router.push('/')" class="text-info">Login here</span>
                    </span>
                    
                    <h6 class="system-version text-center">Tubig Carmelo Online Ordering System <br /> UAT v1.0.0</h6>
                </v-form>
            </v-sheet>
            <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="4000" top>
                {{ snackbar.message }}
            </v-snackbar>
        </v-container>
    </div>
</template>

<script>
import { useBenefeciaryStore } from '@/stores/benefeciaryStore';
import { useLoadingStore } from '@/stores/loading';
import { ref  } from 'vue';

export default {
    name: 'RegisterPage',
    setup() {
        const loadingStore = useLoadingStore();
        const benefeciaryStore = useBenefeciaryStore();
        const newCustomerForm = ref(null);
        return {
            loadingStore,
            benefeciaryStore,
            newCustomerForm
        };
    },
    data() {
        return {
            logo: require('@/assets/DSWD-logo.png'),
            user_name: '',
            email: '',
            password: '',
            showPassword: false,
            isFormValid: false,
            loading: false,
            confirmDialog: false,
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

        async submitNewBranch() {
            try {
                if (!(await this.newCustomerForm.validate())) return;
                this.loadingStore.show("Saving...")
                const payload = {
                    user_name: this.user_name,
                    email: this.email,
                    password: this.password,
                };
                const response = await this.benefeciaryStore.savebenefeciaryStore(payload);
                if (response && response.message) {
                    this.confirmDialog = false;
                    this.showSnackbar(response.message, 'success');
                    this.resetForm();
                } else {
                    throw new Error('Branch creation failed');
                }
            } catch (error) {
                console.error(error, 'error');
                this.showSnackbar(error, 'error');
                this.confirmDialog = false;
            } finally {
                this.loadingStore.hide();
            }
        },

        resetForm() {
            this.user_name = '';
            this.email = '';
            this.password = '';
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
    width: 100dvw;
    height: 100dvh;
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

.registration-text {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.username-text {
    margin-top: 20px;
}

.v-input__details {
    display: flex;
}

.register-btn {
    border: 1px solid #fff;
    background-color: transparent;
}

.system-version {
    margin-top: 100px !important;
    color: #d3eaff;
}
</style>