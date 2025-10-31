<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-row>
        <v-col cols="12">
            <div class="top-container">
                <div class="d-flex justify-space-between">
                    <h3 class="mt-14 ms-3">Digital ID</h3>
                    <img :src="logo" loading="lazy" alt="Poofsa Logo" />
                </div>
            </div>
        </v-col>
        <v-col cols="12">
            <v-container class="mb-5">
                <div class="card-container">
                    <div class="mb-10 pa-4">
                        <div class="d-flex align-center flex-column">
                            <h4 style="font-size: 15px;" class="mt-2">CSWD DIGITAL IDENTIFICATION CARD</h4>
                            <h4 class="mt-5" style="color: #fff;">ID No. &nbsp; {{ this.reference_number }}</h4>
                            <img class="my-image" :src="imgSrc" alt="Benefeciary Image">
                            <h4 style="color: #fff; font-size: 18px;">
                                {{ this.first_name }}
                                {{ this.middle_name }}
                                {{ this.last_name }}
                                <span style="color: #fff;" v-if="this.suffix">{{ this.suffix }}</span>
                            </h4>
                            <h4 class="mt-1">{{ this.category_label }}</h4>
                        </div>
                    </div>

                    <div class="d-flex flex-column pa-4">
                        <div class="mt-10">
                            <div class="d-flex justify-space-between">
                                <div class="pa-2 mt-5">
                                    <h5>Contact No.</h5>
                                    <h5 style="color: #837600;">{{ this.contact_number }}</h5>
                                    <div class="mt-3">
                                        <h5>Email</h5>
                                        <h5 style="color: #837600;">{{ this.email }}</h5>
                                    </div>
                                    <div class="mt-3">
                                        <h5>Address</h5>
                                        <h5 style="color: #837600;">{{ this.address_line1 }},
                                                Brgy. {{ this.barangay_name }}, {{
                                                    this.address_line3 }}
                                        </h5>
                                    </div>
                                </div>
                                <div>
                                    <img :src="imgSealSrc" class="image-seal" loading="lazy" alt="Official Seal">
                                </div>
                            </div>
                        </div>
                        
                        
                    </div>
                    <div class="text-center pb-7">
                        <img v-if="imgQRSrc" 
                            :src="imgQRSrc" 
                            loading="lazy" 
                            alt="Benefeciary QR Code" 
                            style="width: 120px; height: 120px; border-radius: 10px;">
                    </div>
                </div>
            </v-container>
        </v-col>
    </v-row>
    <Alert ref="alertRef" />
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { useBenefeciaryStore } from '@/stores/benefeciaryStore';
import Alert from '@/components/Alert.vue';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'DigitalID',

    components: {
        Alert,
    },

    data() {
        return {
            logo: require('@/assets/DSWD-logo.png'),
            benefeciary_info: '',
            reference_number: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            address_line1: '',
            barangay_name: '',
            address_line3: '',
            contact_number: '',
            email: '',
            category_label: '',
            imgSrc: null,
            imgQRSrc: null,
            imgSealSrc: require('@/assets/Official-Seal.jpg'),
        }
    },

    setup() {
        const authStore = useAuthStore();
        const benefeciaryStore = useBenefeciaryStore();
        return {
            authStore,
            benefeciaryStore,
        };
    },

    mounted() {
        this.fetchBenefeciary();
    },

    beforeUnmount() {
        if (this.imgQRSrc) {
            URL.revokeObjectURL(this.imgQRSrc);
        }
    },

    methods: {

        async fetchBenefeciary() {
            try {
                const response = await this.benefeciaryStore.fetchBenefeciaryStore();
                if (!response || response.status !== true) {
                    this.showAlert('Failed to fetch benefeciary information. Please try again.');
                    return;
                } else {
                    this.benefeciary_info = this.benefeciaryStore.benefeciary;
                    this.reference_number = this.benefeciary_info.reference_number;
                    this.first_name = this.benefeciary_info.first_name;
                    this.middle_name = this.benefeciary_info.middle_name;
                    this.last_name = this.benefeciary_info.last_name;
                    this.suffix = this.benefeciary_info.suffix;
                    this.address_line1 = this.benefeciary_info.address_line1;
                    this.barangay_name = this.benefeciary_info.barangay_name;
                    this.address_line3 = this.benefeciary_info.address_line3;
                    this.contact_number = this.benefeciary_info.contact_number;
                    this.email = this.benefeciary_info.email;
                    this.category_label = this.benefeciary_info.category_label;
                    this.fetchQRCode(this.benefeciary_info.reference_number);
                    this.fetchImageID(this.benefeciary_info.reference_number);
                }
            } catch (error) {
                console.error(error);
                this.showAlert();
            } finally {
                // this.loadingCurrentOrders = false;
            }
        },

        async fetchQRCode(referenceNumber) {
            try {
                const qrCodeBlob = await this.benefeciaryStore.fetchQRcodeTempStore(referenceNumber);
                this.imgQRSrc = URL.createObjectURL(qrCodeBlob);
                if (!this.imgQRSrc) {
                    console.error('Failed to create image URL from blob');
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                this.imgQRSrc = '';
            }
        },

        async fetchImageID(referenceNumber) {
            try {
                const qrCodeBlob = await this.benefeciaryStore.fetchImageIDStore(referenceNumber);
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
    },
};
</script>

<style scoped>
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

span {
    text-transform: none;
    color: #696969;
}

h5,
h6 {
    margin: 0;
    padding: 0;
    font-weight: normal;
}

h4 {
    color: #dac400;
    font-size: 14px;
}

h5 {
    font-size: 12px;
    color: #000270;
}

h6 {
    font-size: 8px;
    font-weight: normal;

}

.my-image {
    width: 120px; 
    height: 120px; 
    border-radius: 10px; 
    border: 5px solid #fff;
}

.image-seal {
    filter: opacity(0.5);
    border-radius: 50%;
    width: 100px;
}

.card-container {
    background-image: url('../assets/ID-BG.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-blend-mode:color-dodge;
    border-radius: 10px;
    background-color: #060b4d;
}
</style>