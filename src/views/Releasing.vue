<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-row>
        <v-col cols="12">
            <div class="top-container">
                <div class="d-flex justify-space-between">
                    <h3 class="mt-14 ms-3">Releasing</h3>
                    <img :src="logo" loading="lazy" alt="Poofsa Logo" />
                </div>
            </div>
        </v-col>
        <v-col cols="12">
            <v-container :class="{ 'd-none': this.releasingCashData.length === 0 }"
                v-if="this.releasingCashData.length > 0">
                <v-card>
                    <v-card-text>
                        <div class="mb-4 mt-2">
                            <span class="text-grey">Hand-over Date: </span>
                            <h3>{{ this.dateOfHandOver }}</h3>
                        </div>
                        <div class="mb-4">
                            <span class="text-grey">Coordinated by: </span>
                            <h3>{{ this.coordinatedPersonnel }}</h3>
                        </div>
                        <div class="mb-4">
                            <span class="text-grey">Designation: </span>
                            <h3>Brgy. {{ this.designatedBrgy }}</h3>
                        </div>
                        <div class="mb-4">
                            <span class="text-grey">Venue: </span>
                            <h3>{{ this.designatedVenue }}</h3>

                        </div>
                        <div class="mb-4">
                            <span class="text-grey">Type of AICS benefit : </span>
                            <h3>{{ this.benefitType }}</h3>
                        </div>
                        <div class="mb-4">
                            <span class="text-grey">Benefactor: </span>
                            <h3>{{ this.designatedBeneficiaries }}</h3>
                        </div>
                        <div>
                            <span class="text-grey">Cash amount: </span>
                            <div class="d-flex">
                                <h3 v-if="showMyCash">{{ this.formatAmount(cashAmount) }}</h3>
                                <h3 v-else>*********</h3>
                                <v-icon @click="toggleCash" class="ms-3" style="cursor: pointer;">
                                    {{ showMyCash ? 'mdi-eye-off' : 'mdi-eye' }}
                                </v-icon>
                            </div>
                            
                        </div>
                        <div class="receive-btn">
                            <v-chip variant="flat" color="green" prepend-icon="mdi-handshake-outline" class="px-5"
                                @click="confirmHandOver" :disabled="this.releasingSatusId === 2">
                                Receive
                            </v-chip>
                        </div>
                    </v-card-text>
                </v-card>
            </v-container>
            <v-sheet v-else>
                <v-alert type="info" 
                    variant="tonal"
                    style="margin-top: 50%;">
                    <span style="font-size: 14px;">&nbsp; No cash assistance schedule yet.</span>
                </v-alert>
            </v-sheet>
        </v-col>
    </v-row>
    <Alert ref="alertRef" />
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { useBenefeciaryStore } from '@/stores/benefeciaryStore';
import { useLoadingStore } from '@/stores/loading';

import Alert from '@/components/Alert.vue';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Releasing',

    components: {
        Alert,
    },

    data() {
        return {
            releasingCashData: '',
            handOverEventID: '',
            handOverStatusID: '',
            dateOfHandOver: '',
            coordinatedPersonnel: '',
            designatedVenue: '',
            benefitType: '',
            designatedBrgy: '',
            designatedBeneficiaries: '',
            releasingSatusId: '',
            releasingSatus: '',
            cashAmount: '',
            logo: require('@/assets/DSWD-logo.png'),
            showMyCash: false,
        }
    },

    setup() {
        const authStore = useAuthStore();
        const loadingStore = useLoadingStore();
        const benefeciaryStore = useBenefeciaryStore();
        return {
            authStore,
            loadingStore,
            benefeciaryStore,
        };
    },

    mounted() {
        this.fetchReleasingCash();
    },

    methods: {

        async fetchReleasingCash() {
            this.loadingStore.show('');
            try {
                await this.benefeciaryStore.fetchReleasingCashStore();
                this.releasingCashData = this.benefeciaryStore.releasingCashBenef;
                if (this.releasingCashData && this.releasingCashData.length > 0) {
                    this.handOverEventID = Number(this.releasingCashData[0].hand_over_event_id);
                    this.handOverStatusID = Number(this.releasingCashData[0].hand_over_status_id);
                    this.dateOfHandOver = this.releasingCashData[0].hand_over_date;
                    this.coordinatedPersonnel = this.releasingCashData[0].coordinator;
                    this.designatedVenue = this.releasingCashData[0].venue;
                    this.benefitType = this.releasingCashData[0].benefit_type;
                    this.designatedBrgy = `${this.releasingCashData[0].barangay_name}`.trim();
                    this.designatedBeneficiaries = this.releasingCashData[0].category_label;
                    this.releasingSatusId = this.releasingCashData[0].hand_over_status_id
                    this.releasingSatus = this.releasingCashData[0].hand_over_status_label;
                    this.cashAmount = this.releasingCashData[0].cash_amount;
                }
            } catch (error) {
                console.error(error);
                this.showAlert(error);
            } finally {
                this.loadingHandOverBenef = false;
                this.loadingStore.hide();
            }
        },

        toggleCash() {
            this.showMyCash = !this.showMyCash;
        },

        confirmHandOver() {
            this.loadingStore.show("Updating...")
            this.releasingSatusId = 2;
            this.releasingSatus = "Done";
            setTimeout(() => this.updateReleasingCashStatus(), 3000);
        },

        async updateReleasingCashStatus() {
            try {
                const payload = new FormData();
                payload.append("hand_over_event_id", this.handOverEventID);
                payload.append("hand_over_status_id", this.handOverStatusID);
                const response = await this.benefeciaryStore.updateReleasingCashStatusStore(payload);
                this.showSuccess("You just confirmed the AICS benefit cash.");
                this.releasingCashData.length = 0;
                setTimeout(() => response, 1000);
                window.location.href='/digital-id';
            } catch (error) {
                console.error(error);
                this.showAlert(error);
            } finally {
                this.loadingStore.hide();
            }
        },

        formatAmount(amount) {
            return new Intl.NumberFormat('en-PH', {
                style: 'currency',
                currency: 'PHP',
            }).format(amount);
        },

        showSuccess(message) {
            this.$refs.alertRef.showSnackbarAlert(message, "success");
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

.receive-btn {
    display: flex;
    justify-content: end;
}
</style>