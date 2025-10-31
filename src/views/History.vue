<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-row>
        <v-col cols="12">
            <div class="top-container">
                <div class="d-flex justify-space-between">
                    <h3 class="mt-14 ms-3">History</h3>
                    <img :src="logo" loading="lazy" alt="Poofsa Logo" />
                </div>
            </div>
        </v-col>
        <v-col cols="12">
            <template v-if="releasingCashData.length > 0">
                <div v-for="(item, index) in releasingCashData" :key="index">
                    <div class="history-content">
                        <span class="d-flex flex-column w-50">
                            <h6>Hand-over date</h6>
                            <h6>Venue</h6>
                            <h6>Type of benefit</h6>
                            <h6>Coordinated by</h6>
                            <h4>Amount Received</h4>
                        </span>
                        <span class="w-50">
                            <h6>{{ item.hand_over_date }}</h6>
                            <h6>{{ item.venue }}</h6>
                            <h6>{{ item.benefit_type }}</h6>
                            <h6>{{ item.coordinator }}</h6>
                            <h4>{{ this.formatAmount(item.cash_amount) }}</h4>
                        </span>
                    </div>
                </div>
            </template>
            <v-sheet v-else>
                <v-alert type="info" 
                    variant="tonal"
                    style="margin-top: 50%;">
                    <span style="font-size: 14px;">&nbsp; No cash assistance history yet.</span>
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
    name: 'History',

    components: {
        Alert,
    },

    data() {
        return {
            releasingCashData: [],
            logo: require('@/assets/DSWD-logo.png'),
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
        this.fetchReleasingCashHistory();
    },

    methods: {

        async fetchReleasingCashHistory() {
            this.loadingStore.show('');
            try {
                await this.benefeciaryStore.fetchReleasingCashHistoryStore();
                this.releasingCashData = this.benefeciaryStore.releasingCashHistoryBenef;
            } catch (error) {
                console.error(error);
                this.showAlert(error);
            } finally {
                this.loadingHandOverBenef = false;
                this.loadingStore.hide();
            }
        },

        formatDateTime(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleString('en-PH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Manila'
            });
        },

        formatAmount(amount) {
            return new Intl.NumberFormat('en-PH', {
                style: 'currency',
                currency: 'PHP',
            }).format(amount);
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

.history-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin: 10px;
}

h4,
h6 {
    font-weight: normal !important;
}
</style>