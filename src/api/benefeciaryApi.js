import apiClient from '../axios';

export const BENEFECIARY_API = {
    ENDPOINTS: {
        SAVE_NEW_BENEFECIARY: '/benefeciary/save-new-benefeciary',
        SEND_PINCODE: '/benefeciary/send-pincode',
        FETCH_BENEF_IMAGE: '/benefeciary/benefeciary-image',
        FETCH_BENEF_AUTH_PERSON_IMAGE: '/benefeciary/benefeciary-auth-person-image',
        FETCH_RELEASING_CASH: '/benefeciary/releasing-cash',
        FETCH_RELEASING_CASH_COUNT: '/benefeciary/releasing-cash-count',
        FETCH_RELEASING_CASH_HISTORY: '/benefeciary/releasing-cash-history',
        FETCH_QR_TEMP: '/benefeciary/get-qr-temp',
        UPDATE_BENEFECIARY_INFO: '/benefeciary/update-benefeciary',
        UPDATE_RELEASING_CASH_STATUS: '/benefeciary/update-releasing-cash-status',
        FETCH_BENEFECIARY_INFO: '/benefeciary/benefeciary-info',
    },

    // Create
    async saveNewBenefApi(benefeciaryData) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            };
            // Post request for submission
            const response = await apiClient.post(
                this.ENDPOINTS.SAVE_NEW_BENEFECIARY,
                benefeciaryData,
                config
            );

            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[BENEFECIARY_API] Error saving benefeciary:', error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                'Failed to save benefeciary'
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async sendPinCodeApi(benefeciaryData) {
        try {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };
            const response = await apiClient.post(
                this.ENDPOINTS.SEND_PINCODE,
                benefeciaryData,
                config
            );
            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error("[BENEFECIARY_API] Error saving benefeciary:", error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                "Failed to save benefeciary"
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    // Read
    async fetchBenefeciaryApi() {
        try {
            const authToken = localStorage.getItem('auth_token');
            const beneficiaryID = localStorage.getItem('beneficiary_id');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data'
                },
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_BENEFECIARY_INFO}/${beneficiaryID}`,
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error(error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message);
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchReleasingCashApi() {
        try {
            const authToken = localStorage.getItem('auth_token');
            const beneficiaryID = localStorage.getItem('beneficiary_id');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_RELEASING_CASH}/${beneficiaryID}`,
                config
            );

            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error(error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message);
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchReleasingCashCountApi() {
        try {
            const authToken = localStorage.getItem('auth_token');
            const beneficiaryID = localStorage.getItem('beneficiary_id');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_RELEASING_CASH_COUNT}/${beneficiaryID}`,
                config
            );

            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error(error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message);
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchReleasingCashHistoryApi() {
        try {
            const authToken = localStorage.getItem('auth_token');
            const beneficiaryID = localStorage.getItem('beneficiary_id');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_RELEASING_CASH_HISTORY}/${beneficiaryID}`,
                config
            );

            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error(error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message);
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchImageIDApi(referenceNumber) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                responseType: 'blob',
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_BENEF_IMAGE}/${referenceNumber}`,
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            if (!(response.data instanceof Blob)) {
                console.error('Expected blob but got:', response.data);
                throw new Error('Invalid response: expected image blob');
            }
            return response.data;
        } catch (error) {
            console.error(error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message);
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchAuthPersonImageIDApi(referenceNumber) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                responseType: 'blob',
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_BENEF_AUTH_PERSON_IMAGE}/${referenceNumber}`,
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            if (!(response.data instanceof Blob)) {
                console.error('Expected blob but got:', response.data);
                throw new Error('Invalid response: expected image blob');
            }
            return response.data;
        } catch (error) {
            console.error(error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message);
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchBenefQRcodeTempApi(referenceNumber) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                responseType: 'blob',
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_QR_TEMP}/${referenceNumber}`,
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            if (!(response.data instanceof Blob)) {
                console.error('Expected blob but got:', response.data);
                throw new Error('Invalid response: expected image blob');
            }
            return response.data;
        } catch (error) {
            console.error(error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message);
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    // Update
    async updateReleasingCashStatusApi(payload) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const hand_over_event_id = payload.get('hand_over_event_id');
            if (!hand_over_event_id) {
                throw new Error('Hand-over ID is required for update');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const response = await apiClient.put(
                `${this.ENDPOINTS.UPDATE_RELEASING_CASH_STATUS}/${hand_over_event_id}`, 
                payload,
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error(error);
            const enhancedError = new Error(
                error.response?.data?.message || error.message
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },
};