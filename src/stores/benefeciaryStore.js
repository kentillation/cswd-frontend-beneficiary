import { defineStore } from 'pinia';
import { BENEFECIARY_API } from '@/api/benefeciaryApi';

export const useBenefeciaryStore = defineStore('products', {
    state: () => ({
        allBenefeciaries: [],
        releasingCashBenef: null,
        releasingCashBenefCount: 0,
        releasingCashHistoryBenef: [],
        benefeciary: '',
        loading: false,
        error: null
    }),

    actions: {

        // Create new benefeciary
        async saveNewBenefStore(benefeciaryData) {
            this.loading = true;
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.saveNewBenefApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.saveNewBenefApi(benefeciaryData);
                if (response && (response.status === true)) {
                    return response;
                } else {
                    throw new Error('Failed to save benefeciary');
                }
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async sendPinCodeStore(benefeciaryData) {
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.sendPinCodeApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.sendPinCodeApi(benefeciaryData);
                if (response && (response.status === true)) {
                    return response;
                }
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                this.error = null;
            }
        },

        // Read
        async fetchBenefeciaryStore() {
            this.loading = true;
            this.error = null;
            try {
                
                const response = await BENEFECIARY_API.fetchBenefeciaryApi();
                if (response && response.status === true) {
                    this.benefeciary = response.data;
                    return response;
                }
            } catch (error) {
                console.error(error);
                this.error = error.message;
                throw error;
            }
            finally {
                this.loading = false;
            }
        },

        async fetchReleasingCashStore() {
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.fetchReleasingCashApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.fetchReleasingCashApi();
                if (response && response.status === true) {
                    this.releasingCashBenef = response.data;
                } else {
                    throw new Error('Failed to fetch hand-over event data');
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        },

        async fetchReleasingCashCountStore() {
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.fetchReleasingCashCountApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.fetchReleasingCashCountApi();
                if (response && response.status === true) {
                    this.releasingCashBenefCount = response.data.count;
                } else {
                    throw new Error('Failed to fetch hand-over event data');
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        },

        async fetchReleasingCashHistoryStore() {
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.fetchReleasingCashHistoryApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.fetchReleasingCashHistoryApi();
                if (response && response.status === true) {
                    this.releasingCashHistoryBenef = response.data;
                } else {
                    throw new Error('Failed to fetch hand-over event data');
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        },

        async fetchQRcodeTempStore(referenceNumber) {
            this.loading = true;
            this.error = null;
            try {
                if (!referenceNumber) {
                    throw new Error('Invalid referenceNumber');
                }
                const qrCodeBlob = await BENEFECIARY_API.fetchBenefQRcodeTempApi(referenceNumber);
                if (qrCodeBlob) {
                    return qrCodeBlob;
                } else {
                    throw new Error('Failed to fetch QR Code');
                }
            } catch (error) {
                console.error(error);
                this.error = error.message;
                throw error;
            }
            finally {
                this.loading = false;
            }
        },

        async fetchImageIDStore(referenceNumber) {
            this.loading = true;
            this.error = null;
            try {
                if (!referenceNumber) {
                    throw new Error('Invalid referenceNumber');
                }
                const imageIDBlob = await BENEFECIARY_API.fetchImageIDApi(referenceNumber);
                if (imageIDBlob) {
                    return imageIDBlob;
                } else {
                    throw new Error('Failed to fetch QR Code');
                }
            } catch (error) {
                console.error(error);
                this.error = error.message;
                throw error;
            }
            finally {
                this.loading = false;
            }
        },

        async fetchAuthPersonImageIDStore(referenceNumber) {
            this.error = null;
            try {
                if (!referenceNumber) {
                    throw new Error('Invalid referenceNumber');
                }
                const imageIDBlob = await BENEFECIARY_API.fetchAuthPersonImageIDApi(referenceNumber);
                if (imageIDBlob) {
                    return imageIDBlob;
                } else {
                    throw new Error('Failed to fetch QR Code');
                }
            } catch (error) {
                console.error(error);
                this.error = error.message;
                throw error;
            }
            finally {
                this.error = null;
            }
        },

        // Update
        async updateReleasingCashStatusStore(payload) {
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.updateReleasingCashStatusApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.updateReleasingCashStatusApi(payload);
                if (response && (response.status === true)) {
                    return response;
                } else {
                    throw new Error('Failed to update releasing cash status');
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        },

    },
});