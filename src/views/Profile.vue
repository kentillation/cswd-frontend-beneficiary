<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-row>
        <v-col cols="12">
            <div class="top-container">
                <div class="d-flex justify-space-between">
                    <h3 class="mt-14 ms-3">Profile</h3>
                    <img :src="logo" loading="lazy" alt="Poofsa Logo" />
                </div>
            </div>
        </v-col>
        <v-col cols="12" class="pt-0">
            <v-container>
                <v-btn @click="openAccountDialog" class="btn-list" variant="flat">
                    <h5><v-icon size="x-large">mdi-account-circle-outline</v-icon>&nbsp; Account</h5>
                    <v-icon size="x-large" class="chevron-icon">mdi-chevron-right</v-icon>
                </v-btn>
                <v-btn @click="themeDialog = true" class="btn-list" variant="flat">
                    <h5><v-icon size="x-large">mdi-theme-light-dark</v-icon>&nbsp; Theme</h5>
                    <v-icon size="x-large" class="chevron-icon">mdi-chevron-right</v-icon>
                </v-btn>
                <v-btn class="btn-list" variant="flat">
                    <h5><v-icon size="x-large">mdi-information-outline</v-icon>&nbsp; About</h5>
                    <v-icon size="x-large" class="chevron-icon">mdi-chevron-right</v-icon>
                </v-btn>
                <v-btn class="btn-list" variant="flat">
                    <h5><v-icon size="x-large">mdi-help-circle-outline</v-icon>&nbsp; Help</h5>
                    <v-icon size="x-large" class="chevron-icon">mdi-chevron-right</v-icon>
                </v-btn>
                <v-btn @click="showLogout" class="btn-list" variant="flat">
                    <h5><v-icon size="x-large">mdi-door-open</v-icon>&nbsp; Signout</h5>
                    <v-icon size="x-large" class="chevron-icon">mdi-chevron-right</v-icon>
                </v-btn>
            </v-container>
        </v-col>
    </v-row>

    <v-dialog v-model="accountDialog" width="500">
        <v-btn @click="accountDialog = false" class="position-absolute" size="small"
            style="top: -50px; right: -17px; z-index: 1;" icon>
            <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card>
            <v-card-title>
                <h3>Account Info</h3>
            </v-card-title>
            <v-card-text>
                <div class="d-flex flex-column mb-3">
                    <div>
                        <span class="text-grey">Name: </span>
                        <span>{{ this.first_name }} {{ this.middle_name }} {{ this.last_name }}  {{ this.suffix }}</span>
                    </div>
                    <div>
                        <span class="text-grey">Birthdate: </span>
                        <span>{{ this.birthdate }}</span>
                    </div>
                    <div>
                        <span class="text-grey">Age: </span>
                        <span>{{ this.benef_age }}</span>
                    </div>
                    <div>
                        <span class="text-grey">Address: </span>
                        <span>{{ this.address_line1 }}, Brgy. {{ this.barangay_name }}, {{ this.address_line3 }}</span>
                    </div>
                    <div>
                        <span class="text-grey">Gender: </span>
                        <span>{{ this.gender_label }}</span>
                    </div>
                    <div>
                        <span class="text-grey">Blood type: </span>
                        <span>{{ this.bloodtype_label }}</span>
                    </div>
                    <div>
                        <span class="text-grey">Beneficiary type: </span>
                        <span>{{ this.category_label }}</span>
                    </div>
                    <div>
                        <span class="text-grey">Contact no.: </span>
                        <span>{{ this.contact_number }}</span>
                    </div>
                    <div>
                        <span class="text-grey">Email: </span>
                        <span>{{ this.email }}</span>
                    </div>
                </div>
            
                <h3>Authorize Person</h3>
                <div class="d-flex flex-column">
                    <div>
                        <span class="text-grey">Name: </span>
                        <span>{{ this.benef_auth_person_first_name }} {{ this.benef_auth_person_middle_name }} {{ this.benef_auth_person_last_name }}</span>
                    </div>
                    <span class="text-grey">Image: </span>
                    <img :src="imgSrc" class="auth-person-img" loading="lazy" alt="Benefeciary Image">
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>

    <v-dialog v-model="themeDialog" width="500">
        <v-btn @click="themeDialog = false" class="position-absolute" size="small"
            style="top: -50px; right: -17px; z-index: 1;" icon>
            <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card class="pa-2">
            <v-card-title>
                <h3>Theme settings</h3>
            </v-card-title>
            <v-card-text>
                <div class="d-flex flex-column">
                    <v-radio-group v-model="selectedTheme" class="ms-5">
                        <v-radio label="Dark" value="dark"></v-radio>
                        <v-radio label="Light" value="light"></v-radio>
                    </v-radio-group>
                </div>
            </v-card-text>
            <v-spacer></v-spacer>
            <div class="d-flex justify-space-between pa-3">
                <v-btn prepend-icon="mdi-magic-staff" color="primary" variant="tonal" @click="applyTheme">Apply</v-btn>
                <v-btn prepend-icon="mdi-information-outline" color="error" variant="tonal"
                    @click="themeDialog = false">
                    <span class="to-hide">Change later</span>
                    <span class="to-show">Later</span>
                </v-btn>
            </div>
        </v-card>
    </v-dialog>
    <Alert ref="alertRef" />
</template>

<script>
import { useTheme } from 'vuetify';
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import { useBenefeciaryStore } from '@/stores/benefeciaryStore';
import Alert from '@/components/Alert.vue';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Settings',
    components: {
        Alert,
    },
    data() {
        return {
            logo: require('@/assets/DSWD-logo.png'),
            beneficiaryInfo: [],
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            birthdate: '',
            benef_age: '',
            address_line1: '',
            barangay_name: '',
            address_line3: '',
            gender_label: '',
            bloodtype_label: '',
            category_label: '',
            contact_number: '',
            email: '',
            benef_auth_person_first_name: '',
            benef_auth_person_middle_name: '',
            benef_auth_person_last_name: '',
            accountDialog: false,
            imgSrc: null,
        }
    },

    setup() {
        const authStore = useAuthStore();
        const loadingStore = useLoadingStore();
        const benefeciaryStore = useBenefeciaryStore();
        const theme = useTheme();
        const themeDialog = ref(false);
        const selectedTheme = ref(theme.global.name.value);
        const currentThemeName = computed(() => {
            return theme.global.name.value === 'dark' ? 'Dark' : 'Light';
        });
        const applyTheme = () => {
            theme.global.name.value = selectedTheme.value;
            localStorage.setItem('theme', selectedTheme.value);
            themeDialog.value = false;
        };
        return {
            authStore,
            loadingStore,
            benefeciaryStore,
            theme,
            themeDialog,
            selectedTheme,
            currentThemeName,
            applyTheme,
        };
    },

    beforeUnmount() {
        if (this.imgSrc) {
            URL.revokeObjectURL(this.imgSrc);
        }
    },

    methods: {

        openAccountDialog() {
            this.accountDialog = true;
            this.fetchBenefInfo();
        },

        async fetchBenefInfo() {
            this.loadingStore.show('');
            try {
                await this.benefeciaryStore.fetchBenefeciaryStore();
                this.beneficiaryInfo = this.benefeciaryStore.benefeciary || [];
                this.first_name = this.beneficiaryInfo.first_name;
                this.middle_name = this.beneficiaryInfo.middle_name;
                this.last_name = this.beneficiaryInfo.last_name;
                this.suffix = this.beneficiaryInfo.suffix;
                this.birthdate = this.beneficiaryInfo.birthdate;
                this.benef_age = this.beneficiaryInfo.benef_age;
                this.address_line1 = this.beneficiaryInfo.address_line1;
                this.barangay_name = this.beneficiaryInfo.barangay_name;
                this.address_line3 = this.beneficiaryInfo.address_line3;
                this.gender_label = this.beneficiaryInfo.gender_label;
                this.bloodtype_label = this.beneficiaryInfo.bloodtype_label;
                this.category_label = this.beneficiaryInfo.category_label;
                this.contact_number = this.beneficiaryInfo.contact_number;
                this.email = this.beneficiaryInfo.email;
                this.benef_auth_person_first_name = this.beneficiaryInfo.benef_auth_person_first_name;
                this.benef_auth_person_middle_name = this.beneficiaryInfo.benef_auth_person_middle_name;
                this.benef_auth_person_last_name = this.beneficiaryInfo.benef_auth_person_last_name;
                this.fetchAuthPersonImageID(this.beneficiaryInfo.reference_number);
            } catch (error) {
                console.error(error);
                this.showAlert('Failed to load beneficiary info.');
            } finally {
                this.loadingStore.hide();
            }
        },

        async fetchAuthPersonImageID(referenceNumber) {
            try {
                const qrCodeBlob = await this.benefeciaryStore.fetchAuthPersonImageIDStore(referenceNumber);
                this.imgSrc = URL.createObjectURL(qrCodeBlob);
                if (!this.imgSrc) {
                    console.error('Failed to create image URL from blob');
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                this.imgSrc = '';
            }
        },

        showAlert(message) {
            this.$refs.alertRef.showSnackbarAlert(message, "error");
        },

        showSuccess(message) {
            this.$refs.alertRef.showSnackbarSuccess(message, "success");
        },

        async showLogout() {
            await this.authStore.logout();
        },
    },
};
</script>

<style scoped>
.descriptionColor {
    color: #a3a3a3;
}

.v-icon {
  padding: 20px !important;
}

.top-container {
    min-height: 85px;
    width: 100%;
    height: 85px;
    background: url('@/assets/buildings.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

img {
    width: 80px;
    margin: 5px;
}

.btn-list {
    display: flex !important;
    justify-content: space-between !important;
    border-radius: 20px;
    padding-top: 15px;
    padding-bottom: 15px;
    width: 100%;
    margin-bottom: 10px;
    background-color: transparent;
}

.chevron-icon {
    color: #3c70ff;
    position: absolute;
    right: 0px;
}

span {
    font-size: 14px;
}

.auth-person-img {
    width: 130px; 
    height: 130px; 
    border-radius: 10px;
    margin-top: 7px;
}
</style>