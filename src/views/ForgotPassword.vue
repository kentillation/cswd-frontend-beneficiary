<template>
    <div class="login-bg">
        <div>
            <v-sheet>
                <div class="d-flex justify-center">
                    <img :src="logo" loading="lazy" width="50" alt="Logo" />
                </div>
                <p class="text-center mb-3 pa-2">Enter your email to change password</p>
                <v-form ref="form" @submit.prevent="handleSendPinCode" v-model="isFormValid" class="pa-4">
                    <span class="text-white">Email</span>
                    <v-text-field v-model="email" 
                        :rules="[requiredRule, emailFormatRule]"
                        placeholder="Type here..."
                        class="text-info"
                        prepend-inner-icon="mdi-email-outline"
                        variant="outlined"
                        density="compact"
                        autocomplete="email" />

                    <v-btn :disabled="!isFormValid || loading" type="submit" color="#004fb6" size="large" class="proceed-btn" height="45" block rounded>
                        Proceed
                    </v-btn>
                    <div class="to-login">
                        <p class="text-white">Has already an account? 
                            <span class="text-info" @click="$router.push('/')">Login here</span>
                        </p>
                    </div>
                    
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
import { useBenefeciaryStore } from '@/stores/benefeciaryStore';
import { useLoadingStore } from '@/stores/loading';
import { shallowRef } from 'vue';

export default {
    name: 'ForgotPassword',
    setup() {
        const loadingStore = useLoadingStore();
        const benefeciaryStore = useBenefeciaryStore();
        return {
            mpin: shallowRef(''),
            loadingStore,
            benefeciaryStore,
        };
    },
    data() {
        return {
            logo: require('@/assets/DSWD-logo.png'),
            email: '',
            pincode: '',
            isFormValid: false,
            loading: false,
            snackbar: {
                visible: false,
                message: '',
                color: ''
            },
        };
    },
    computed: {
        newPinCode() {
            return this.generatePincode();
        },
    },
    methods: {
        requiredRule(v) {
            return !!v || 'This field is required';
        },

        emailFormatRule(v) {
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return pattern.test(v) || 'Invalid email format';
        },

        async generatepincode() {
            const generatedPin = Math.random().toString().slice(2, 10);
            console.log('Generated Reference Number:', generatedPin);
            return generatedPin;
        },

        async handleSendPinCode() {
            this.loadingStore.show('');
            try {
                if (!isValid) return;
                this.loading = true;
                const isValid = await this.$refs.form.validate();
                let pincode = typeof this.newPinCode === 'function' || typeof this.newPinCode?.then === 'function'
                    ? await this.newPinCode
                    : this.newPinCode;
                const payload = new FormData();
                payload.append("email", this.email);
                payload.append("pincode", pincode);
                await this.benefeciaryStore.sendPinCodeStore(payload);
                window.location.href = '/pin-code';
            } catch (error) {
                this.showSnackbar(error || 'Please try again!', 'error');
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

.to-login {
    color: #fffcfc;
    font-size: 14px;
    text-align: center;
    margin-top: 10px !important;
}

.v-input__details {
    display: flex;
}

.proceed-btn {
    margin-top: 20px !important;
}

.system-version {
    margin-top: 100px !important;
    color: #d3eaff;
}
</style>