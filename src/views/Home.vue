<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-row>
        <v-col cols="12">
            <div class="top-container">
                <div class="d-flex justify-space-between">
                    <h3 class="mt-14 ms-3">Home</h3>
                    <img :src="logo" loading="lazy" alt="Poofsa Logo" />
                </div>
            </div>
        </v-col>
        <v-col cols="12">
            <div class="text-center">
            </div>
        </v-col>
    </v-row>
    <Alert ref="alertRef" />
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import Alert from '@/components/Alert.vue';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Home',
    components: {
        Alert,
    },
    data() {
        return {
            logo: require('@/assets/DSWD-logo.png'),
        }
    },
    setup() {
        const authStore = useAuthStore();
        return {
            authStore,
        };
    },
    methods: {
        toRefillWater() {
            this.$router.push('/refill-water');
        },
        toBuyWaterWithContainer() {
            this.$router.push('/buy-water-with-container');
        },
        toBuyContainer() {
            this.$router.push('/buy-container');
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
    width: 70px;
}

.btn-card-container {
    display: flex;
    margin-bottom: 12px;
}

.btn-card {
    width: 50%;
}

span {
  text-transform: none;
}

</style>